import hashlib
import html
import io
import json
import logging
import re
import shutil
import subprocess
import tempfile
from pathlib import Path

import httpx
from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import JSONResponse, Response
from PIL import Image

from ..config import settings

log = logging.getLogger(__name__)

_NASA_APOD_URL = "https://api.nasa.gov/planetary/apod"
_THUMB_MAX_WIDTH = 1280
_NO_CACHE_HEADERS = {"Cache-Control": "no-cache"}

# Fallback used when the primary API key is rate-limited/unavailable, or
# today's entry has no still image (e.g. a video we can't self-host). Scrapes
# the public archive for the most recent day that does have one, so the
# frontend never has to be told "no image" as long as apod.nasa.gov is up.
_ARCHIVE_URL = "https://apod.nasa.gov/apod/archivepixFull.html"
_APOD_BASE = "https://apod.nasa.gov/apod/"
_ARCHIVE_MAX_ENTRIES = 10

_ARCHIVE_ENTRY_RE = re.compile(r'<a href="(ap(\d{6})\.html)">([^<]*)</a>')
_LINKED_IMG_RE = re.compile(r'<a href="([^"]+\.(?:jpg|jpeg|png|gif))">\s*<img\s+src="([^"]+)"', re.IGNORECASE)
_BARE_IMG_RE = re.compile(r'<img\s+src="([^"]+)"', re.IGNORECASE)
_VIDEO_SOURCE_RE = re.compile(r'<source\s+src="([^"]+\.(?:mp4|webm|mov|m4v|mkv))"', re.IGNORECASE)
_TITLE_TAG_RE = re.compile(r'<title>\s*APOD:.*?[–-]\s*(.*?)\s*</title>', re.IGNORECASE | re.DOTALL)
_EXPLANATION_RE = re.compile(r'Explanation:\s*</b>\s*(.*?)(?:<p>|<center>)', re.IGNORECASE | re.DOTALL)

# Some APOD "video" days are self-hosted files we can transcode; others are
# YouTube/Vimeo embeds we can't (and shouldn't) scrape. Only the former get a
# playable /api/apod/video — everything else just falls back to a still image.
_VIDEO_EXTENSIONS = (".mp4", ".webm", ".mov", ".m4v", ".mkv")
_VIDEO_MAX_WIDTH = 854    # ~480p — decodes smoothly on old/low-end devices
_VIDEO_MAX_FPS = 30
_VIDEO_MAX_SECONDS = 120  # safety cap; APOD videos are normally under a minute

DATA_DIR = Path(__file__).resolve().parents[2] / "data" / "apod"
_META_PATH = DATA_DIR / "meta.json"
_THUMB_PATH = DATA_DIR / "thumb.webp"
_FULL_PATH = DATA_DIR / "full.webp"
_VIDEO_PATH = DATA_DIR / "video.webm"

_cache_date: str | None = None
_cache_meta: dict | None = None
_cache_thumb: bytes | None = None
_cache_full: bytes | None = None
_cache_video: bytes | None = None
_cache_etag: str | None = None
_cache_mtime: float | None = None  # mtime of meta.json when the in-memory copy was loaded


def _ffmpeg_bin() -> str | None:
    """Resolved at call time so an ffmpeg installed after startup is picked up without a restart."""
    return shutil.which("ffmpeg")


def log_startup_diagnostics() -> None:
    """Surface the two silent misconfigurations that leave the site stuck on an old APOD."""
    if not _ffmpeg_bin():
        log.error(
            "[apod] ffmpeg is NOT on PATH — video-day APODs cannot be ingested; "
            "the site will keep serving the previous day's image until ffmpeg is installed"
        )
    if settings.nasa_api_key == "DEMO_KEY":
        log.warning(
            "[apod] NASA_API_KEY is not set — using DEMO_KEY (~30 req/hour/IP, shared); "
            "expect 429s and archive fallbacks. Set a real key in backend/.env"
        )


def _write_atomic(path: Path, data: bytes) -> None:
    tmp = path.with_suffix(path.suffix + ".tmp")
    tmp.write_bytes(data)
    tmp.replace(path)  # atomic on POSIX — old file is replaced in one step


def _load_from_disk() -> bool:
    """Populate the in-memory cache from what an earlier process wrote to disk.

    Lets a fresh process (restart, or a second uvicorn worker) serve the last
    good APOD immediately instead of returning 503 until its own network
    fetch succeeds.
    """
    global _cache_date, _cache_meta, _cache_thumb, _cache_full, _cache_video, _cache_etag, _cache_mtime
    if not (_META_PATH.exists() and _THUMB_PATH.exists() and _FULL_PATH.exists()):
        return False
    try:
        mtime = _META_PATH.stat().st_mtime
        meta = json.loads(_META_PATH.read_text())
        thumb = _THUMB_PATH.read_bytes()
        full = _FULL_PATH.read_bytes()
        video = _VIDEO_PATH.read_bytes() if _VIDEO_PATH.exists() else None
    except Exception as exc:
        log.error("[apod] failed to load cache from disk: %s", exc)
        return False
    _cache_meta, _cache_thumb, _cache_full, _cache_video = meta, thumb, full, video
    _cache_date = meta.get("date")
    _cache_etag = hashlib.sha1(full + (video or b"")).hexdigest()[:16]
    _cache_mtime = mtime
    return True


def _is_direct_video_url(url: str) -> bool:
    return url.lower().split("?")[0].endswith(_VIDEO_EXTENSIONS)


async def _fetch_primary_meta(client: httpx.AsyncClient) -> dict | None:
    try:
        r = await client.get(_NASA_APOD_URL, params={"api_key": settings.nasa_api_key})
        r.raise_for_status()
        meta = r.json()
    except Exception as exc:
        log.warning("[apod] primary API request failed: %s", exc)
        return None
    if meta.get("media_type") not in ("image", "video"):
        log.info("[apod] today's entry is neither image nor video (%s)", meta.get("media_type"))
        return None
    return meta


async def _fetch_primary_image(client: httpx.AsyncClient, meta: dict) -> bytes | None:
    try:
        img_r = await client.get(meta.get("hdurl") or meta["url"])
        img_r.raise_for_status()
        return img_r.content
    except Exception as exc:
        log.warning("[apod] primary image download failed: %s", exc)
        return None


async def _fetch_primary_video(client: httpx.AsyncClient, meta: dict) -> bytes | None:
    url = meta.get("url", "")
    if not _is_direct_video_url(url):
        log.info("[apod] video is an external embed (%s), not self-hosted — skipping", url)
        return None
    try:
        video_r = await client.get(url)
        video_r.raise_for_status()
        return video_r.content
    except Exception as exc:
        log.warning("[apod] primary video download failed: %s", exc)
        return None


def _decode_apod_date(code: str) -> str:
    yy, mm, dd = int(code[:2]), int(code[2:4]), int(code[4:6])
    year = 1900 + yy if yy >= 95 else 2000 + yy
    return f"{year:04d}-{mm:02d}-{dd:02d}"


def _scrape_title_explanation(page_html: str, anchor_title: str) -> tuple[str, str]:
    title_m = _TITLE_TAG_RE.search(page_html)
    title = html.unescape(title_m.group(1).strip()) if title_m else html.unescape(anchor_title.strip())

    explanation = ""
    expl_m = _EXPLANATION_RE.search(page_html)
    if expl_m:
        explanation = re.sub(r"<[^>]+>", "", expl_m.group(1))
        explanation = html.unescape(re.sub(r"\s+", " ", explanation).strip())
    return title, explanation


async def _fetch_from_archive(client: httpx.AsyncClient) -> tuple[dict, bytes, str] | None:
    """Walk the public archive, newest first, until a day with usable media is found.

    Self-hosted videos (a <source src="…mp4"> on the page) are ingested through the
    same transcode pipeline as the primary API — but only when ffmpeg is available;
    otherwise the walk continues to the most recent still image. Returns
    (meta, asset_bytes, kind) where kind is "image" or "video".
    """
    try:
        r = await client.get(_ARCHIVE_URL)
        r.raise_for_status()
    except Exception as exc:
        log.error("[apod] archive listing request failed: %s", exc)
        return None

    entries = _ARCHIVE_ENTRY_RE.findall(r.text)[:_ARCHIVE_MAX_ENTRIES]
    for href, code, anchor_title in entries:
        try:
            page_r = await client.get(_APOD_BASE + href)
            page_r.raise_for_status()
            page_html = page_r.text
        except Exception as exc:
            log.warning("[apod] archive page %s failed: %s", href, exc)
            continue

        vid_m = _VIDEO_SOURCE_RE.search(page_html)
        if vid_m and _ffmpeg_bin():
            vid_src = vid_m.group(1)
            vid_url = vid_src if vid_src.startswith("http") else _APOD_BASE + vid_src
            try:
                vid_r = await client.get(vid_url)
                vid_r.raise_for_status()
            except Exception as exc:
                log.warning("[apod] archive video %s failed: %s", vid_url, exc)
            else:
                title, explanation = _scrape_title_explanation(page_html, anchor_title)
                meta = {"title": title, "date": _decode_apod_date(code), "explanation": explanation, "media_type": "video"}
                log.info("[apod] using archive fallback video for %s (%s)", meta["date"], title)
                return meta, vid_r.content, "video"

        m = _LINKED_IMG_RE.search(page_html)
        img_src = m.group(1) if m else None
        if img_src is None:
            m = _BARE_IMG_RE.search(page_html)
            if not m:
                continue  # embedded-video/non-image day — try the previous entry
            img_src = m.group(1)

        img_url = img_src if img_src.startswith("http") else _APOD_BASE + img_src
        try:
            img_r = await client.get(img_url)
            img_r.raise_for_status()
        except Exception as exc:
            log.warning("[apod] archive image %s failed: %s", img_url, exc)
            continue

        title, explanation = _scrape_title_explanation(page_html, anchor_title)
        meta = {"title": title, "date": _decode_apod_date(code), "explanation": explanation, "media_type": "image"}
        log.info("[apod] using archive fallback for %s (%s)", meta["date"], title)
        return meta, img_r.content, "image"

    log.error("[apod] no usable media found in the last %d archive entries", len(entries))
    return None


def _run_ffmpeg(args: list[str], timeout: int) -> bool:
    try:
        subprocess.run(args, check=True, capture_output=True, timeout=timeout)
        return True
    except subprocess.CalledProcessError as exc:
        stderr = exc.stderr.decode(errors="replace")[-500:] if exc.stderr else ""
        log.error("[apod] ffmpeg exited with %s: %s", exc.returncode, stderr)
        return False
    except Exception as exc:
        log.error("[apod] ffmpeg failed: %s", exc)
        return False


def _transcode_video(video_bytes: bytes) -> bytes | None:
    """Re-encode to a small VP9/WebM so low-end devices can decode it smoothly."""
    ffmpeg = _ffmpeg_bin()
    if not ffmpeg:
        log.error("[apod] ffmpeg not found on PATH — cannot transcode video")
        return None
    with tempfile.TemporaryDirectory() as tmp:
        src, dst = Path(tmp) / "src", Path(tmp) / "out.webm"
        src.write_bytes(video_bytes)
        ok = _run_ffmpeg([
            ffmpeg, "-y", "-i", str(src),
            "-t", str(_VIDEO_MAX_SECONDS),
            "-vf", f"scale='min({_VIDEO_MAX_WIDTH},iw)':-2,fps={_VIDEO_MAX_FPS}",
            "-c:v", "libvpx-vp9", "-crf", "34", "-b:v", "0",
            "-deadline", "good", "-cpu-used", "2", "-row-mt", "1",
            "-c:a", "libopus", "-b:a", "96k", "-ac", "2",
            str(dst),
        ], timeout=300)
        if not ok or not dst.exists():
            return None
        return dst.read_bytes()


def _extract_poster_frame(video_bytes: bytes) -> bytes | None:
    ffmpeg = _ffmpeg_bin()
    if not ffmpeg:
        log.error("[apod] ffmpeg not found on PATH — cannot extract a poster frame")
        return None
    with tempfile.TemporaryDirectory() as tmp:
        src, dst = Path(tmp) / "src", Path(tmp) / "poster.jpg"
        src.write_bytes(video_bytes)
        ok = _run_ffmpeg([ffmpeg, "-y", "-ss", "1", "-i", str(src), "-frames:v", "1", "-q:v", "2", str(dst)], timeout=30)
        if not ok or not dst.exists():
            return None
        return dst.read_bytes()


def _encode_webp_pair(img_bytes: bytes) -> tuple[bytes, bytes]:
    img = Image.open(io.BytesIO(img_bytes)).convert("RGB")

    thumb = img.copy()
    if thumb.width > _THUMB_MAX_WIDTH:
        new_h = round(thumb.height * _THUMB_MAX_WIDTH / thumb.width)
        thumb = thumb.resize((_THUMB_MAX_WIDTH, new_h), Image.LANCZOS)
    buf = io.BytesIO()
    thumb.save(buf, "WEBP", quality=75)
    thumb_bytes = buf.getvalue()

    buf = io.BytesIO()
    img.save(buf, "WEBP", quality=85)
    full_bytes = buf.getvalue()

    # Sanity-check the encoded output before it replaces the last good cache.
    Image.open(io.BytesIO(thumb_bytes)).verify()
    Image.open(io.BytesIO(full_bytes)).verify()
    return thumb_bytes, full_bytes


def _persist(meta: dict, thumb_bytes: bytes, full_bytes: bytes, video_bytes: bytes | None) -> None:
    global _cache_date, _cache_meta, _cache_thumb, _cache_full, _cache_video, _cache_etag, _cache_mtime

    DATA_DIR.mkdir(parents=True, exist_ok=True)
    _write_atomic(_THUMB_PATH, thumb_bytes)
    _write_atomic(_FULL_PATH, full_bytes)
    if video_bytes:
        _write_atomic(_VIDEO_PATH, video_bytes)
    else:
        _VIDEO_PATH.unlink(missing_ok=True)  # e.g. today replaced a video day with an image day
    _write_atomic(_META_PATH, json.dumps(meta).encode())

    _cache_meta, _cache_thumb, _cache_full, _cache_video = meta, thumb_bytes, full_bytes, video_bytes
    _cache_date = meta["date"]
    _cache_etag = hashlib.sha1(full_bytes + (video_bytes or b"")).hexdigest()[:16]
    _cache_mtime = _META_PATH.stat().st_mtime
    log.info("[apod] cache refreshed for %s (thumb=%dKB full=%dKB video=%s)",
             _cache_date, len(thumb_bytes) // 1024, len(full_bytes) // 1024,
             f"{len(video_bytes) // 1024}KB" if video_bytes else "none")


def _process_and_persist_image(meta: dict, img_bytes: bytes) -> None:
    thumb_bytes, full_bytes = _encode_webp_pair(img_bytes)
    _persist({**meta, "has_video": False}, thumb_bytes, full_bytes, None)


def _process_and_persist_video(meta: dict, video_bytes: bytes) -> None:
    poster_bytes = _extract_poster_frame(video_bytes)
    if poster_bytes is None:
        raise RuntimeError("could not extract a poster frame from the video")
    thumb_bytes, full_bytes = _encode_webp_pair(poster_bytes)

    webm_bytes = _transcode_video(video_bytes)
    if webm_bytes is None:
        log.warning("[apod] video transcode unavailable — serving poster only")

    _persist({**meta, "has_video": webm_bytes is not None}, thumb_bytes, full_bytes, webm_bytes)


async def refresh() -> None:
    """Check NASA for today's APOD and, only if it changed, re-process and persist it.

    Self-hosted videos are transcoded to a small WebM plus a poster image.
    Falls back to scraping the public archive when the primary API is
    unavailable (rate limit, outage) or today's entry has no usable media, so
    the backend always has *some* image to serve as long as apod.nasa.gov is up.
    """
    if _cache_meta is None:
        _load_from_disk()

    meta: dict | None = None
    kind: str | None = None
    asset_bytes: bytes | None = None

    async with httpx.AsyncClient(timeout=60) as client:
        primary_meta = await _fetch_primary_meta(client)
        if primary_meta and primary_meta["date"] == _cache_date and _cache_full is not None:
            log.info("[apod] no change since last check (%s)", _cache_date)
            return

        if primary_meta:
            media_type = primary_meta.get("media_type")
            if media_type == "image":
                asset_bytes = await _fetch_primary_image(client, primary_meta)
                kind = "image"
            elif media_type == "video":
                asset_bytes = await _fetch_primary_video(client, primary_meta)
                kind = "video"
            if asset_bytes:
                meta = {k: primary_meta[k] for k in ("title", "date", "explanation", "media_type") if k in primary_meta}

        if asset_bytes is None:
            log.warning("[apod] primary source unavailable, falling back to NASA archive")
            fallback = await _fetch_from_archive(client)
            if fallback:
                meta, asset_bytes, kind = fallback

    if asset_bytes is None or meta is None:
        log.error("[apod] primary API and archive fallback both failed — keeping last cached image")
        return

    if meta["date"] == _cache_date and _cache_full is not None:
        log.info("[apod] no change since last check (%s)", _cache_date)
        return

    try:
        if kind == "video":
            _process_and_persist_video(meta, asset_bytes)
        else:
            _process_and_persist_image(meta, asset_bytes)
    except Exception as exc:
        log.error("[apod] processing failed: %s", exc)


async def _ensure_cache() -> None:
    """Load the cache, re-reading from disk when another worker's refresh has replaced it."""
    try:
        disk_mtime = _META_PATH.stat().st_mtime
    except OSError:
        disk_mtime = None
    if _cache_meta is None or (disk_mtime is not None and disk_mtime != _cache_mtime):
        _load_from_disk()
    if _cache_meta is None:
        await refresh()


def _not_modified(request: Request) -> bool:
    return bool(_cache_etag) and request.headers.get("if-none-match") == _cache_etag


def _headers() -> dict:
    headers = dict(_NO_CACHE_HEADERS)
    if _cache_etag:
        headers["ETag"] = _cache_etag
    return headers


router = APIRouter(tags=["apod"])


@router.get("/api/apod")
async def apod_meta(request: Request):
    await _ensure_cache()
    if not _cache_meta:
        raise HTTPException(status_code=503, detail="APOD not available")
    if _not_modified(request):
        return Response(status_code=304, headers=_headers())
    return JSONResponse(content=_cache_meta, headers=_headers())


@router.get("/api/apod/thumb")
async def apod_thumb(request: Request):
    await _ensure_cache()
    if not _cache_thumb:
        raise HTTPException(status_code=503, detail="APOD not available")
    if _not_modified(request):
        return Response(status_code=304, headers=_headers())
    return Response(content=_cache_thumb, media_type="image/webp", headers=_headers())


@router.get("/api/apod/image")
async def apod_image(request: Request):
    await _ensure_cache()
    if not _cache_full:
        raise HTTPException(status_code=503, detail="APOD not available")
    if _not_modified(request):
        return Response(status_code=304, headers=_headers())
    return Response(content=_cache_full, media_type="image/webp", headers=_headers())


@router.get("/api/apod/video")
async def apod_video(request: Request):
    await _ensure_cache()
    if not _cache_video:
        raise HTTPException(status_code=503, detail="APOD video not available")
    if _not_modified(request):
        return Response(status_code=304, headers=_headers())
    return Response(content=_cache_video, media_type="video/webm", headers=_headers())
