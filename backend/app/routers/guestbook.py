from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..database import get_db
from ..limiter import limiter
from ..models import GuestbookEntry
from ..schemas import GuestbookEntryCreate, GuestbookEntryOut, GuestbookPage

router = APIRouter(prefix="/api/guestbook", tags=["guestbook"])

_PAGE = 5


def _normalize_city(city: str | None) -> str | None:
    return city.strip().title() if city and city.strip() else None


@router.get("", response_model=GuestbookPage)
async def get_guestbook(skip: int = 0, db: AsyncSession = Depends(get_db)):
    rows = (
        await db.execute(
            select(GuestbookEntry)
            .where(GuestbookEntry.approved == True)  # noqa: E712
            .order_by(GuestbookEntry.submitted_at.desc())
            .offset(skip)
            .limit(_PAGE + 1)
        )
    ).scalars().all()
    has_more = len(rows) > _PAGE
    return GuestbookPage(entries=rows[:_PAGE], has_more=has_more)


@router.post("", status_code=201, response_model=GuestbookEntryOut)
@limiter.limit("5/minute")
async def submit_entry(
    request: Request,
    body: GuestbookEntryCreate,
    db: AsyncSession = Depends(get_db),
):
    entry = GuestbookEntry(
        name=body.name,
        city=_normalize_city(body.city),
        message=body.message,
    )
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
    entry.city    = _normalize_city(body.city)
    entry.message = body.message
    await db.commit()
    await db.refresh(entry)
    return entry
