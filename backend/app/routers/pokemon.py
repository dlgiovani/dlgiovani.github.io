import asyncio

import httpx
from fastapi import APIRouter, Depends, Request
from sqlalchemy import select
from sqlalchemy.dialects.postgresql import insert as pg_insert
from sqlalchemy.ext.asyncio import AsyncSession

from ..database import get_db
from ..limiter import limiter
from ..models import PokemonTranslation
from ..schemas import PokemonNamesRequest

router = APIRouter(prefix="/api/pokemon", tags=["pokemon"])

POKEAPI_SPECIES = "https://pokeapi.co/api/v2/pokemon-species/{id}"


async def _fetch_species_names(client: httpx.AsyncClient, pokemon_id: int) -> tuple[int, str, str] | None:
    try:
        res = await client.get(POKEAPI_SPECIES.format(id=pokemon_id), timeout=5)
        if res.status_code != 200:
            return None
        data = res.json()
        names = {n["language"]["name"]: n["name"] for n in data.get("names", [])}
        name_en = names.get("en")
        name_pt_br = names.get("pt-br") or name_en
        if not name_en or not name_pt_br:
            return None
        return pokemon_id, name_en, name_pt_br
    except (httpx.HTTPError, KeyError, ValueError):
        return None


@router.post("/names", response_model=dict[int, str])
@limiter.limit("20/minute")
async def get_pokemon_names(
    request: Request,
    body: PokemonNamesRequest,
    db: AsyncSession = Depends(get_db),
):
    ids = list(dict.fromkeys(body.ids))[:20]

    rows = (
        await db.execute(select(PokemonTranslation).where(PokemonTranslation.id.in_(ids)))
    ).scalars().all()
    result = {row.id: row.name_pt_br for row in rows}

    missing = [i for i in ids if i not in result]
    if missing:
        async with httpx.AsyncClient() as client:
            fetched = await asyncio.gather(*[_fetch_species_names(client, i) for i in missing])
        for entry in fetched:
            if entry is None:
                continue
            pokemon_id, name_en, name_pt_br = entry
            stmt = pg_insert(PokemonTranslation).values(
                id=pokemon_id, name_en=name_en, name_pt_br=name_pt_br,
            ).on_conflict_do_update(
                index_elements=["id"],
                set_=dict(name_en=name_en, name_pt_br=name_pt_br),
            )
            await db.execute(stmt)
            result[pokemon_id] = name_pt_br
        await db.commit()

    return result
