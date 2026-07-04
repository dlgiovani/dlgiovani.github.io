from datetime import datetime, timezone

from sqlalchemy import JSON, BigInteger, Boolean, Float, ForeignKey, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .database import Base


class TickerCache(Base):
    __tablename__ = "ticker_cache"

    key: Mapped[str] = mapped_column(String, primary_key=True)
    value: Mapped[float] = mapped_column(Float, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(server_default=func.now(), onupdate=func.now())



class PokemonPick(Base):
    __tablename__ = "pokemon_picks"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    uid: Mapped[str | None] = mapped_column(String(64), unique=True, nullable=True)
    pokemon_name: Mapped[str] = mapped_column(Text, nullable=False)
    city: Mapped[str | None] = mapped_column(Text)
    lat: Mapped[float | None] = mapped_column(Float)
    lon: Mapped[float | None] = mapped_column(Float)
    picked_at: Mapped[datetime] = mapped_column(server_default=func.now())


class PokemonTranslation(Base):
    __tablename__ = "pokemon_translations"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True)  # PokeAPI species id
    name_en: Mapped[str] = mapped_column(Text, nullable=False)
    name_pt_br: Mapped[str] = mapped_column(Text, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(server_default=func.now(), onupdate=func.now())


class GuestbookEntry(Base):
    __tablename__ = "guestbook_entries"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(Text, nullable=False)
    city: Mapped[str | None] = mapped_column(Text)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    approved: Mapped[bool] = mapped_column(Boolean, default=True)
    submitted_at: Mapped[datetime] = mapped_column(server_default=func.now())


class ConsultingRequest(Base):
    __tablename__ = "consulting_requests"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    category: Mapped[str] = mapped_column(Text, nullable=False)
    name: Mapped[str] = mapped_column(Text, nullable=False)
    contact: Mapped[str] = mapped_column(Text, nullable=False)
    company: Mapped[str | None] = mapped_column(Text)
    message: Mapped[str | None] = mapped_column(Text)
    extra_note: Mapped[str | None] = mapped_column(Text)
    links: Mapped[list | None] = mapped_column(JSON)
    submitted_at: Mapped[datetime] = mapped_column(server_default=func.now())
    handled_at: Mapped[datetime | None] = mapped_column(nullable=True)  # null = not yet handled

    attachments: Mapped[list["ConsultingAttachment"]] = relationship(
        back_populates="request", cascade="all, delete-orphan"
    )


class ConsultingAttachment(Base):
    __tablename__ = "consulting_attachments"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    request_id: Mapped[int] = mapped_column(
        BigInteger, ForeignKey("consulting_requests.id", ondelete="CASCADE"), nullable=False
    )
    kind: Mapped[str] = mapped_column(Text, nullable=False)  # voice | media | board
    original_filename: Mapped[str] = mapped_column(Text, nullable=False)
    stored_filename: Mapped[str] = mapped_column(Text, nullable=False)
    content_type: Mapped[str] = mapped_column(Text, nullable=False)
    size_bytes: Mapped[int] = mapped_column(BigInteger, nullable=False)
    created_at: Mapped[datetime] = mapped_column(server_default=func.now())

    request: Mapped[ConsultingRequest] = relationship(back_populates="attachments")
