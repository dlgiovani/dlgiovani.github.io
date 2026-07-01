from datetime import datetime

from pydantic import BaseModel, Field


class TickerResponse(BaseModel):
    EUR_USD: float
    BTC_USD: float
    ETH_USD: float
    GBP_USD: float


class SignalsResponse(BaseModel):
    total: int
    today: int
    cities: int
    countries: int



class PokemonPickItem(BaseModel):
    name: str
    count: int


class PokemonPickEntry(BaseModel):
    name: str
    count: int


class PokemonPickByCity(BaseModel):
    city: str
    lat: float
    lon: float
    total: int
    picks: list[PokemonPickEntry]


class PokemonPickCreate(BaseModel):
    pokemon_name: str = Field(min_length=1, max_length=60)
    city: str | None = Field(default=None, max_length=100)
    lat: float | None = None
    lon: float | None = None
    uid: str | None = Field(default=None, max_length=64)


class PokemonNamesRequest(BaseModel):
    ids: list[int] = Field(min_length=1, max_length=20)


class GuestbookEntryOut(BaseModel):
    id: int
    name: str
    city: str | None
    message: str
    submitted_at: datetime

    model_config = {"from_attributes": True}


class GuestbookPage(BaseModel):
    entries: list[GuestbookEntryOut]
    has_more: bool


class GuestbookEntryCreate(BaseModel):
    name: str = Field(min_length=1, max_length=80)
    city: str | None = Field(default=None, max_length=100)
    message: str = Field(min_length=1, max_length=500)


class ConsultingAttachmentOut(BaseModel):
    id: int
    kind: str
    original_filename: str
    content_type: str
    size_bytes: int
    download_path: str


class ConsultingRequestOut(BaseModel):
    id: int
    category: str
    name: str
    contact: str
    company: str | None
    message: str | None
    extra_note: str | None
    links: list[str] | None
    submitted_at: datetime
    attachments: list[ConsultingAttachmentOut]


class ConsultingSubmitOut(BaseModel):
    id: int
    submitted_at: datetime

    model_config = {"from_attributes": True}


class LangEntry(BaseModel):
    name: str
    pct: int
    color: str


class GithubStatsOut(BaseModel):
    commits: int
    repos: int
    streak: int
    max_streak: int
    avg_per_month: int
    commits_today: int
    commits_total: int


class GithubDataResponse(BaseModel):
    heatmap: list[list[int]]
    langs: list[LangEntry]
    stats: GithubStatsOut
