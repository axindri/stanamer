from __future__ import annotations

import logging
from typing import Any

import httpx

from app.config import Settings

logger = logging.getLogger(__name__)


def ssl_verify_option(settings: Settings) -> bool | str:
    """Return httpx/OpenAI verify value: False, True, or CA bundle path."""
    if settings.openai_ca_bundle.strip():
        path = settings.openai_ca_bundle.strip()
        logger.info("TLS verify via CA bundle | path=%s", path)
        return path
    if not settings.openai_verify_ssl:
        logger.warning(
            "TLS certificate verification is DISABLED (OPENAI_VERIFY_SSL=false)"
        )
        return False
    return True


def build_async_http_client(settings: Settings, **kwargs: Any) -> httpx.AsyncClient:
    verify = ssl_verify_option(settings)
    return httpx.AsyncClient(verify=verify, follow_redirects=True, **kwargs)
