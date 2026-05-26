from datetime import date, datetime

from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from ..database import get_db
from ..geo import city_to_country
from ..models import GuestbookEntry, PokemonPick
from ..schemas import SignalsResponse

router = APIRouter(prefix="/api", tags=["signals"])


@router.get("/signals", response_model=SignalsResponse)
async def get_signals(db: AsyncSession = Depends(get_db)):
    today_start = datetime.combine(date.today(), datetime.min.time())

    gb_total = await db.scalar(select(func.count()).select_from(GuestbookEntry)) or 0
    pk_total = await db.scalar(select(func.count()).select_from(PokemonPick))   or 0
    gb_today = await db.scalar(
        select(func.count()).select_from(GuestbookEntry).where(GuestbookEntry.submitted_at >= today_start)
    ) or 0
    pk_today = await db.scalar(
        select(func.count()).select_from(PokemonPick).where(PokemonPick.picked_at >= today_start)
    ) or 0

    gb_cities = (await db.scalars(
        select(GuestbookEntry.city).where(GuestbookEntry.city.isnot(None)).distinct()
    )).all()
    pk_cities = (await db.scalars(
        select(PokemonPick.city).where(PokemonPick.city.isnot(None)).distinct()
    )).all()
    all_cities = set(gb_cities) | set(pk_cities)
    countries  = len({city_to_country(c) for c in all_cities} - {None})

    return SignalsResponse(
        total=gb_total + pk_total,
        today=gb_today + pk_today,
        cities=len(all_cities),
        countries=countries,
    )
