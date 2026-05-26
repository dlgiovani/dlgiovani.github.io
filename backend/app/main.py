import logging

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware

from .config import settings
from .limiter import limiter
from .routers import guestbook, github, picks, signals, ticker
from .routers.github import _update_cache as refresh_github
from .scheduler import maybe_refresh_on_start, start_scheduler

logging.basicConfig(level=logging.INFO)


@asynccontextmanager
async def lifespan(app: FastAPI):
    start_scheduler()
    await maybe_refresh_on_start()
    await refresh_github()
    yield


app = FastAPI(title="dlgiovani.dev API", lifespan=lifespan)
app.state.limiter = limiter

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.origins_list,
    allow_methods=["GET", "POST", "PATCH"],
    allow_headers=["Content-Type"],
)
app.add_middleware(SlowAPIMiddleware)
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.include_router(ticker.router)
app.include_router(signals.router)
app.include_router(picks.router)
app.include_router(guestbook.router)
app.include_router(github.router)


@app.get("/health")
async def health():
    return {"status": "ok"}
