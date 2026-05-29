import io
import logging
from datetime import datetime, timezone

import httpx
from fastapi import APIRouter, HTTPException
from fastapi.responses import Response
from PIL import Image

from ..config import settings

log = logging.getLogger(__name__)

_cache_date: str | None = None
_cache_meta: dict | None = None
_cache_thumb: bytes | None = None
_cache_full: bytes | None = None

_THUMB_MAX_WIDTH = 1280
_WEBP_HEADERS = {"Cache-Control": "public, max-age=86400"}


async def refresh() -> None:
    global _cache_date, _cache_meta, _cache_thumb, _cache_full
    try:
        async with httpx.AsyncClient(timeout=30) as client:
            r = await client.get(
                "https://api.nasa.gov/planetary/apod",
                params={"api_key": settings.nasa_api_key},
            )
            r.raise_for_status()
            meta = r.json()

            if meta.get("media_type") != "image":
                log.info("[apod] today's entry is not an image (%s), skipping", meta.get("media_type"))
                return

            img_r = await client.get(meta.get("hdurl") or meta["url"])
            img_r.raise_for_status()

        img = Image.open(io.BytesIO(img_r.content)).convert("RGB")

        thumb = img.copy()
        if thumb.width > _THUMB_MAX_WIDTH:
            new_h = round(thumb.height * _THUMB_MAX_WIDTH / thumb.width)
            thumb = thumb.resize((_THUMB_MAX_WIDTH, new_h), Image.LANCZOS)
        buf = io.BytesIO()
        thumb.save(buf, "WEBP", quality=75)
        _cache_thumb = buf.getvalue()

        buf = io.BytesIO()
        img.save(buf, "WEBP", quality=85)
        _cache_full = buf.getvalue()

        _cache_meta = {k: meta[k] for k in ("title", "date", "explanation", "media_type") if k in meta}
        _cache_date = meta["date"]
        log.info("[apod] cache refreshed for %s (thumb=%dKB full=%dKB)",
                 _cache_date, len(_cache_thumb) // 1024, len(_cache_full) // 1024)
    except Exception as exc:
        log.error("[apod] refresh failed: %s", exc)


async def _ensure_cache() -> None:
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    if _cache_date != today or _cache_meta is None:
        await refresh()


router = APIRouter(tags=["apod"])


@router.get("/api/apod")
async def apod_meta():
    await _ensure_cache()
    if not _cache_meta:
        raise HTTPException(status_code=503, detail="APOD not available")
    return _cache_meta


@router.get("/api/apod/thumb")
async def apod_thumb():
    await _ensure_cache()
    if not _cache_thumb:
        raise HTTPException(status_code=503, detail="APOD not available")
    return Response(content=_cache_thumb, media_type="image/webp", headers=_WEBP_HEADERS)


@router.get("/api/apod/image")
async def apod_image():
    await _ensure_cache()
    if not _cache_full:
        raise HTTPException(status_code=503, detail="APOD not available")
    return Response(content=_cache_full, media_type="image/webp", headers=_WEBP_HEADERS)
