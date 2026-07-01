import asyncio
import logging
from datetime import datetime, timezone

import httpx
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from sqlalchemy import func, select, update

from .config import settings
from .database import SessionLocal
from .models import TickerCache
from .routers.apod import refresh as refresh_apod
from .routers.github import _update_cache as refresh_github

log = logging.getLogger(__name__)

scheduler = AsyncIOScheduler()

_FX_PAIRS = ["EUR", "GBP"]  # base USD
_CRYPTO_IDS = {"BTC": "bitcoin", "ETH": "ethereum"}


async def refresh_fx() -> None:
    url = f"https://v6.exchangerate-api.com/v6/{settings.exchangerateapi_key}/latest/USD"
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            r = await client.get(url)
            r.raise_for_status()
            rates = r.json()["conversion_rates"]
        updates = {
            "EUR_USD": round(1 / rates["EUR"], 6),
            "GBP_USD": round(1 / rates["GBP"], 6),
        }
        async with SessionLocal() as db:
            for key, value in updates.items():
                existing = await db.scalar(select(TickerCache).where(TickerCache.key == key))
                if existing:
                    await db.execute(
                        update(TickerCache).where(TickerCache.key == key).values(value=value)
                    )
                else:
                    db.add(TickerCache(key=key, value=value))
            await db.commit()
        log.info("FX rates refreshed: %s", updates)
    except Exception as exc:
        log.error("FX refresh failed: %s", exc)


async def refresh_crypto() -> None:
    url = "https://api.freecryptoapi.com/v1/getData"
    headers = {"Authorization": f"Bearer {settings.freecryptoapi_key}"}
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            btc_r, eth_r = await asyncio.gather(
                client.get(url, params={"symbol": "BTC"}, headers=headers),
                client.get(url, params={"symbol": "ETH"}, headers=headers),
            )
            btc_r.raise_for_status()
            eth_r.raise_for_status()

        prices: dict[str, float] = {}
        for sym, r in (("BTC", btc_r), ("ETH", eth_r)):
            data = r.json()
            symbols = data.get("symbols", [])
            if symbols:
                prices[f"{sym}_USD"] = round(float(symbols[0]["last"]), 2)

        async with SessionLocal() as db:
            for key, value in prices.items():
                existing = await db.scalar(select(TickerCache).where(TickerCache.key == key))
                if existing:
                    await db.execute(
                        update(TickerCache).where(TickerCache.key == key).values(value=value)
                    )
                else:
                    db.add(TickerCache(key=key, value=value))
            await db.commit()
        log.info("Crypto prices refreshed: %s", prices)
    except Exception as exc:
        log.error("Crypto refresh failed: %s", exc)


_INTERVAL_MINUTES = 60


async def _last_updated_at(keys: list[str]) -> datetime | None:
    """Returns the oldest updated_at among the given keys, or None if any is missing."""
    async with SessionLocal() as db:
        rows = (await db.execute(select(TickerCache).where(TickerCache.key.in_(keys)))).scalars().all()
        if len(rows) < len(keys):
            return None  # at least one key has never been fetched
        oldest = min(r.updated_at for r in rows)
        # updated_at comes from the DB without tzinfo — normalise to UTC
        if oldest.tzinfo is None:
            oldest = oldest.replace(tzinfo=timezone.utc)
        return oldest


async def maybe_refresh_on_start() -> None:
    now = datetime.now(timezone.utc)
    threshold = _INTERVAL_MINUTES * 60  # seconds

    fx_last = await _last_updated_at(["EUR_USD", "GBP_USD"])
    if fx_last is None or (now - fx_last).total_seconds() >= threshold:
        log.info("FX data stale or missing — fetching on startup")
        await refresh_fx()
    else:
        log.info("FX data fresh (last updated %s ago)", now - fx_last)

    crypto_last = await _last_updated_at(["BTC_USD", "ETH_USD"])
    if crypto_last is None or (now - crypto_last).total_seconds() >= threshold:
        log.info("Crypto data stale or missing — fetching on startup")
        await refresh_crypto()
    else:
        log.info("Crypto data fresh (last updated %s ago)", now - crypto_last)


def start_scheduler() -> None:
    scheduler.add_job(refresh_fx,     "interval", minutes=_INTERVAL_MINUTES, id="fx",     replace_existing=True)
    scheduler.add_job(refresh_crypto, "interval", minutes=_INTERVAL_MINUTES, id="crypto", replace_existing=True)
    scheduler.add_job(refresh_github, "interval", hours=1,                   id="github", replace_existing=True)
    scheduler.add_job(refresh_apod,   "interval", hours=1,                   id="apod",   replace_existing=True)
    scheduler.start()
    log.info("Scheduler started (FX + crypto every %d min, GitHub + APOD every 1h)", _INTERVAL_MINUTES)
