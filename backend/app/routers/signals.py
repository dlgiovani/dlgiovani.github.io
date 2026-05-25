from datetime import date, datetime

from fastapi import APIRouter, Depends, Request, Response
from sqlalchemy import distinct, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from ..database import get_db
from ..limiter import limiter
from ..models import Visit
from ..schemas import SignalsResponse, VisitCreate

router = APIRouter(prefix="/api", tags=["signals"])


@router.get("/signals", response_model=SignalsResponse)
async def get_signals(db: AsyncSession = Depends(get_db)):
    today_start = datetime.combine(date.today(), datetime.min.time())

    total = await db.scalar(select(func.count()).select_from(Visit))
    today = await db.scalar(
        select(func.count()).select_from(Visit).where(Visit.visited_at >= today_start)
    )
    cities = await db.scalar(
        select(func.count(distinct(Visit.city))).select_from(Visit).where(Visit.city.isnot(None))
    )
    countries = await db.scalar(
        select(func.count(distinct(Visit.country_code)))
        .select_from(Visit)
        .where(Visit.country_code.isnot(None))
    )

    return SignalsResponse(
        total=total or 0,
        today=today or 0,
        cities=cities or 0,
        countries=countries or 0,
    )


@router.post("/visit", status_code=204)
@limiter.limit("5/minute")
async def record_visit(
    request: Request,
    body: VisitCreate,
    db: AsyncSession = Depends(get_db),
):
    db.add(Visit(city=body.city, lat=body.lat, lon=body.lon))
    await db.commit()
    return Response(status_code=204)
