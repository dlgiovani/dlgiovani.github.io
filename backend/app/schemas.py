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


class PokemonPickByCity(BaseModel):
    city: str
    lat: float
    lon: float
    top_pokemon: str
    count: int


class PokemonPickCreate(BaseModel):
    pokemon_name: str = Field(min_length=1, max_length=60)
    city: str | None = Field(default=None, max_length=100)
    lat: float | None = None
    lon: float | None = None
    uid: str | None = Field(default=None, max_length=64)


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


class LangEntry(BaseModel):
    name: str
    pct: int
    color: str


class GithubStatsOut(BaseModel):
    commits: int
    repos: int
    streak: int
    avg_per_day: int
    commits_today: int


class GithubDataResponse(BaseModel):
    heatmap: list[list[int]]
    langs: list[LangEntry]
    stats: GithubStatsOut
