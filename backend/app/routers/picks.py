from fastapi import APIRouter, Depends, Request, Response
from sqlalchemy import func, select
from sqlalchemy.dialects.postgresql import insert as pg_insert
from sqlalchemy.ext.asyncio import AsyncSession

from ..database import get_db
from ..limiter import limiter
from ..models import PokemonPick
from ..schemas import PokemonPickByCity, PokemonPickCreate, PokemonPickItem

router = APIRouter(prefix="/api/picks", tags=["picks"])


@router.get("", response_model=list[PokemonPickItem])
async def get_picks(db: AsyncSession = Depends(get_db)):
    rows = (
        await db.execute(
            select(PokemonPick.pokemon_name, func.count().label("count"))
            .group_by(PokemonPick.pokemon_name)
            .order_by(func.count().desc())
            .limit(30)
        )
    ).all()
    return [PokemonPickItem(name=row.pokemon_name, count=row.count) for row in rows]


@router.get("/by-city", response_model=list[PokemonPickByCity])
async def get_picks_by_city(db: AsyncSession = Depends(get_db)):
    from sqlalchemy import literal_column
    # Single query: count picks per (city, pokemon), rank by count within each city, keep rank=1
    per_city_pokemon = (
        select(
            PokemonPick.city,
            PokemonPick.lat,
            PokemonPick.lon,
            PokemonPick.pokemon_name,
            func.count().label("cnt"),
        )
        .where(
            PokemonPick.city.isnot(None),
            PokemonPick.lat.isnot(None),
            PokemonPick.lon.isnot(None),
        )
        .group_by(PokemonPick.city, PokemonPick.lat, PokemonPick.lon, PokemonPick.pokemon_name)
        .subquery()
    )
    ranked = (
        select(
            per_city_pokemon,
            func.row_number().over(
                partition_by=per_city_pokemon.c.city,
                order_by=per_city_pokemon.c.cnt.desc(),
            ).label("rn"),
            func.sum(per_city_pokemon.c.cnt).over(
                partition_by=per_city_pokemon.c.city,
            ).label("city_total"),
        )
        .subquery()
    )
    rows = (
        await db.execute(
            select(ranked)
            .where(ranked.c.rn == 1)
            .order_by(ranked.c.city_total.desc())
            .limit(50)
        )
    ).all()
    return [
        PokemonPickByCity(
            city=row.city,
            lat=row.lat,
            lon=row.lon,
            top_pokemon=row.pokemon_name,
            count=row.city_total,
        )
        for row in rows
    ]


@router.post("", status_code=204)
@limiter.limit("5/minute")
async def submit_pick(
    request: Request,
    body: PokemonPickCreate,
    db: AsyncSession = Depends(get_db),
):
    if body.uid:
        stmt = pg_insert(PokemonPick).values(
            uid=body.uid,
            pokemon_name=body.pokemon_name.lower(),
            city=body.city,
            lat=body.lat,
            lon=body.lon,
        ).on_conflict_do_update(
            index_elements=["uid"],
            set_=dict(
                pokemon_name=body.pokemon_name.lower(),
                city=body.city,
                lat=body.lat,
                lon=body.lon,
            ),
        )
        await db.execute(stmt)
    else:
        db.add(PokemonPick(
            pokemon_name=body.pokemon_name.lower(),
            city=body.city,
            lat=body.lat,
            lon=body.lon,
        ))
    await db.commit()
    return Response(status_code=204)
