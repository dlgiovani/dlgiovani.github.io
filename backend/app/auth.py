import secrets

from fastapi import Header, HTTPException

from .config import settings


async def require_api_key(x_api_key: str = Header(default="")) -> None:
    """Guard for owner-only endpoints; compares X-API-Key against ADMIN_API_KEY."""
    if not settings.admin_api_key or not secrets.compare_digest(
        x_api_key.encode(), settings.admin_api_key.encode()
    ):
        raise HTTPException(status_code=403, detail="Invalid API key")
