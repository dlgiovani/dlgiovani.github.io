from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..database import get_db
from ..limiter import limiter
from ..models import GuestbookEntry
from ..schemas import GuestbookEntryCreate, GuestbookEntryOut

router = APIRouter(prefix="/api/guestbook", tags=["guestbook"])


@router.get("", response_model=list[GuestbookEntryOut])
async def get_guestbook(db: AsyncSession = Depends(get_db)):
    rows = (
        await db.execute(
            select(GuestbookEntry)
            .where(GuestbookEntry.approved == True)  # noqa: E712
            .order_by(GuestbookEntry.submitted_at.desc())
            .limit(20)
        )
    ).scalars().all()
    return rows


@router.post("", status_code=201, response_model=GuestbookEntryOut)
@limiter.limit("5/minute")
async def submit_entry(
    request: Request,
    body: GuestbookEntryCreate,
    db: AsyncSession = Depends(get_db),
):
    entry = GuestbookEntry(name=body.name, city=body.city, message=body.message)
    db.add(entry)
    await db.commit()
    await db.refresh(entry)
    return entry


@router.patch("/{entry_id}", response_model=GuestbookEntryOut)
@limiter.limit("10/minute")
async def update_entry(
    entry_id: int,
    request: Request,
    body: GuestbookEntryCreate,
    db: AsyncSession = Depends(get_db),
):
    entry = await db.get(GuestbookEntry, entry_id)
    if not entry:
        raise HTTPException(status_code=404)
    entry.name    = body.name
    entry.city    = body.city
    entry.message = body.message
    await db.commit()
    await db.refresh(entry)
    return entry
