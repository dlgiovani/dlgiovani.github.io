from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..database import get_db
from ..models import TickerCache
from ..schemas import TickerResponse

router = APIRouter(prefix="/api/ticker", tags=["ticker"])


@router.get("", response_model=TickerResponse)
async def get_ticker(db: AsyncSession = Depends(get_db)):
    rows = (await db.execute(select(TickerCache))).scalars().all()
    data = {r.key: r.value for r in rows}
    return TickerResponse(
        EUR_USD=data.get("EUR_USD", 0.0),
        BTC_USD=data.get("BTC_USD", 0.0),
        ETH_USD=data.get("ETH_USD", 0.0),
        GBP_USD=data.get("GBP_USD", 0.0),
    )
