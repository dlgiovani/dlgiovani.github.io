import json
import shutil
import uuid
from pathlib import Path

from fastapi import APIRouter, Depends, File, Form, HTTPException, Request, UploadFile
from fastapi.responses import FileResponse
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from ..auth import require_api_key
from ..database import get_db
from ..limiter import limiter
from ..models import ConsultingAttachment, ConsultingRequest
from ..schemas import (
    ConsultingAttachmentOut,
    ConsultingHandledUpdate,
    ConsultingRequestOut,
    ConsultingSubmitOut,
)

router = APIRouter(prefix="/api/consulting", tags=["consulting"])

_CATEGORIES = {"consulting", "integration", "automation", "else"}
_MAX_FILE_BYTES = 10 * 1024 * 1024
_MAX_MEDIA_FILES = 8
_MAX_LINKS = 10
_UPLOAD_ROOT = Path("data/consulting_uploads")
_CHUNK = 1024 * 1024


def _parse_links(raw: str | None) -> list[str] | None:
    if not raw:
        return None
    try:
        parsed = json.loads(raw)
    except json.JSONDecodeError:
        raise HTTPException(status_code=422, detail="links must be a JSON array")
    if not isinstance(parsed, list) or not all(isinstance(x, str) for x in parsed):
        raise HTTPException(status_code=422, detail="links must be a JSON array of strings")
    links = [x.strip()[:500] for x in parsed if x.strip()][:_MAX_LINKS]
    return links or None


async def _save_upload(upload: UploadFile, dest_dir: Path) -> tuple[str, int]:
    """Stream an upload to disk under a random name; returns (stored_name, size)."""
    suffix = Path(upload.filename or "").suffix[:12]
    stored = f"{uuid.uuid4().hex}{suffix}"
    path = dest_dir / stored
    size = 0
    with open(path, "wb") as out:
        while chunk := await upload.read(_CHUNK):
            size += len(chunk)
            if size > _MAX_FILE_BYTES:
                out.close()
                path.unlink(missing_ok=True)
                raise HTTPException(status_code=413, detail="File too large (10MB max)")
            out.write(chunk)
    return stored, size


@router.post("", status_code=201, response_model=ConsultingSubmitOut)
@limiter.limit("3/minute")
async def submit_request(
    request: Request,
    category: str = Form(...),
    name: str = Form(..., min_length=1, max_length=120),
    contact: str = Form(..., min_length=3, max_length=200),
    company: str | None = Form(None, max_length=200),
    message: str | None = Form(None, max_length=2000),
    extra_note: str | None = Form(None, max_length=8000),
    links: str | None = Form(None, max_length=6000),
    voice: UploadFile | None = File(None),
    board: UploadFile | None = File(None),
    media: list[UploadFile] | None = File(None),
    db: AsyncSession = Depends(get_db),
):
    if category not in _CATEGORIES:
        raise HTTPException(status_code=422, detail="Invalid category")
    media_files = media or []
    if len(media_files) > _MAX_MEDIA_FILES:
        raise HTTPException(status_code=422, detail=f"At most {_MAX_MEDIA_FILES} files")

    entry = ConsultingRequest(
        category=category,
        name=name.strip(),
        contact=contact.strip(),
        company=company.strip() if company and company.strip() else None,
        message=message.strip() if message and message.strip() else None,
        extra_note=extra_note.strip() if extra_note and extra_note.strip() else None,
        links=_parse_links(links),
    )
    db.add(entry)
    await db.flush()

    dest_dir = _UPLOAD_ROOT / str(entry.id)
    uploads: list[tuple[str, UploadFile]] = []
    if voice and voice.filename:
        uploads.append(("voice", voice))
    if board and board.filename:
        uploads.append(("board", board))
    uploads.extend(("media", f) for f in media_files if f.filename)

    if uploads:
        dest_dir.mkdir(parents=True, exist_ok=True)
    try:
        for kind, upload in uploads:
            stored, size = await _save_upload(upload, dest_dir)
            db.add(
                ConsultingAttachment(
                    request_id=entry.id,
                    kind=kind,
                    original_filename=(upload.filename or stored)[:255],
                    stored_filename=stored,
                    content_type=upload.content_type or "application/octet-stream",
                    size_bytes=size,
                )
            )
        await db.commit()
    except Exception:
        await db.rollback()
        shutil.rmtree(dest_dir, ignore_errors=True)
        raise
    await db.refresh(entry)
    return entry


def _to_out(r: ConsultingRequest) -> ConsultingRequestOut:
    return ConsultingRequestOut(
        id=r.id,
        category=r.category,
        name=r.name,
        contact=r.contact,
        company=r.company,
        message=r.message,
        extra_note=r.extra_note,
        links=r.links,
        submitted_at=r.submitted_at,
        handled_at=r.handled_at,
        attachments=[
            ConsultingAttachmentOut(
                id=a.id,
                kind=a.kind,
                original_filename=a.original_filename,
                content_type=a.content_type,
                size_bytes=a.size_bytes,
                download_path=f"/api/consulting/{r.id}/attachments/{a.id}",
            )
            for a in r.attachments
        ],
    )


@router.get("", response_model=list[ConsultingRequestOut], dependencies=[Depends(require_api_key)])
async def list_requests(db: AsyncSession = Depends(get_db)):
    rows = (
        (
            await db.execute(
                select(ConsultingRequest)
                .options(selectinload(ConsultingRequest.attachments))
                .order_by(ConsultingRequest.submitted_at.desc())
            )
        )
        .scalars()
        .all()
    )
    return [_to_out(r) for r in rows]


@router.patch(
    "/{request_id}",
    response_model=ConsultingRequestOut,
    dependencies=[Depends(require_api_key)],
)
async def set_handled(
    request_id: int,
    payload: ConsultingHandledUpdate,
    db: AsyncSession = Depends(get_db),
):
    entry = (
        await db.execute(
            select(ConsultingRequest)
            .options(selectinload(ConsultingRequest.attachments))
            .where(ConsultingRequest.id == request_id)
        )
    ).scalar_one_or_none()
    if entry is None:
        raise HTTPException(status_code=404)
    entry.handled_at = func.now() if payload.handled else None
    await db.commit()
    await db.refresh(entry)
    return _to_out(entry)


@router.get("/{request_id}/attachments/{attachment_id}", dependencies=[Depends(require_api_key)])
async def download_attachment(
    request_id: int,
    attachment_id: int,
    db: AsyncSession = Depends(get_db),
):
    attachment = await db.get(ConsultingAttachment, attachment_id)
    if not attachment or attachment.request_id != request_id:
        raise HTTPException(status_code=404)
    path = _UPLOAD_ROOT / str(request_id) / attachment.stored_filename
    if not path.is_file():
        raise HTTPException(status_code=404, detail="File missing on disk")
    return FileResponse(
        path,
        media_type=attachment.content_type,
        filename=attachment.original_filename,
    )
