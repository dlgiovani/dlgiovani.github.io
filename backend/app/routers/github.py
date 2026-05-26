import logging
from datetime import datetime, timedelta

import httpx
from fastapi import APIRouter, HTTPException

from ..config import settings
from ..schemas import GithubDataResponse, GithubStatsOut, LangEntry

log = logging.getLogger(__name__)

_QUERY = """
query($login: String!) {
  user(login: $login) {
    contributionsCollection {
      contributionCalendar {
        weeks {
          contributionDays { date contributionCount }
        }
      }
    }
    repositories(first: 100, ownerAffiliations: OWNER, privacy: PUBLIC, orderBy: {field: UPDATED_AT, direction: DESC}) {
      totalCount
      nodes {
        languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
          edges { size node { name color } }
        }
      }
    }
  }
}"""

_cache: GithubDataResponse | None = None
_cache_time: datetime | None = None
_CACHE_TTL = timedelta(hours=1)


def _norm(n: int) -> int:
    if n == 0: return 0
    if n <= 3:  return 1
    if n <= 6:  return 2
    if n <= 9:  return 3
    return 4


def _build_heatmap(weeks: list) -> list[list[int]]:
    return [[_norm(d["contributionCount"]) for d in w["contributionDays"]] for w in weeks]


def _calc_streak(weeks: list) -> int:
    days = [d for w in weeks for d in w["contributionDays"]]
    streak = 0
    for d in reversed(days):
        if d["contributionCount"] > 0:
            streak += 1
        else:
            break
    return streak


def _calc_avg_this_month(weeks: list) -> int:
    today = datetime.utcnow()
    ym = f"{today.year}-{today.month:02d}"
    days = [d for w in weeks for d in w["contributionDays"] if d["date"].startswith(ym)]
    if not days:
        return 0
    return round(sum(d["contributionCount"] for d in days) / len(days))


def _build_langs(repos: list) -> list[LangEntry]:
    totals: dict[str, dict] = {}
    for repo in repos:
        for edge in repo["languages"]["edges"]:
            name  = edge["node"]["name"]
            color = edge["node"]["color"] or "#888"
            size  = edge["size"]
            if name in totals:
                totals[name]["size"] += size
            else:
                totals[name] = {"size": size, "color": color}
    top = sorted(totals.items(), key=lambda x: -x[1]["size"])[:6]
    total_bytes = sum(v["size"] for _, v in top)
    if not total_bytes:
        return []
    return [LangEntry(name=n, pct=round(v["size"] / total_bytes * 100), color=v["color"]) for n, v in top]


async def _fetch_github() -> GithubDataResponse:
    async with httpx.AsyncClient(timeout=15) as client:
        r = await client.post(
            "https://api.github.com/graphql",
            json={"query": _QUERY, "variables": {"login": "dlgiovani"}},
            headers={"Authorization": f"Bearer {settings.github_pat}"},
        )
        r.raise_for_status()
        body = r.json()

    if "errors" in body:
        raise ValueError(body["errors"][0]["message"])

    user  = body["data"]["user"]
    weeks = user["contributionsCollection"]["contributionCalendar"]["weeks"]
    all_days = [d for w in weeks for d in w["contributionDays"]]

    return GithubDataResponse(
        heatmap=_build_heatmap(weeks),
        langs=_build_langs(user["repositories"]["nodes"]),
        stats=GithubStatsOut(
            commits=sum(d["contributionCount"] for d in all_days),
            repos=user["repositories"]["totalCount"],
            streak=_calc_streak(weeks),
            avg_per_day=_calc_avg_this_month(weeks),
        ),
    )


async def _update_cache() -> None:
    """Fetch and update in-memory cache; logs on failure (safe for scheduler use)."""
    global _cache, _cache_time
    if not settings.github_pat:
        log.warning("[github] GITHUB_PAT not set — skipping cache update")
        return
    try:
        data = await _fetch_github()
        _cache = data
        _cache_time = datetime.utcnow()
        log.info("[github] Cache refreshed")
    except Exception as exc:
        log.error("[github] Refresh failed: %s", exc)


async def get_or_refresh() -> GithubDataResponse:
    """For the HTTP endpoint — raises HTTPException on failure."""
    global _cache, _cache_time
    if _cache and _cache_time and datetime.utcnow() - _cache_time < _CACHE_TTL:
        return _cache
    if not settings.github_pat:
        raise HTTPException(status_code=503, detail="GITHUB_PAT not configured")
    try:
        data = await _fetch_github()
        _cache = data
        _cache_time = datetime.utcnow()
        return _cache
    except Exception as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc


router = APIRouter(tags=["github"])


@router.get("/api/github-stats", response_model=GithubDataResponse)
async def github_stats():
    return await get_or_refresh()
