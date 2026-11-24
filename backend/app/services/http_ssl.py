from __future__ import annotations

import logging
import ssl
from pathlib import Path
from typing import Any

import httpx
import truststore

from app.config import Settings

logger = logging.getLogger(__name__)


def build_ssl_context(settings: Settings) -> ssl.SSLContext | bool:
    """
    Build TLS settings for httpx / OpenAI.

    VS Code extensions use the OS trust store; plain Python (certifi) does not.
    Default mode mirrors VS Code via `truststore`.
    """
    if not settings.openai_verify_ssl:
        logger.warning(
            "TLS certificate verification is DISABLED (OPENAI_VERIFY_SSL=false)"
        )
        return False

    ca_bundle = settings.openai_ca_bundle.strip()
    if ca_bundle:
        path = Path(ca_bundle)
        if not path.is_file():
            logger.error(
                "OPENAI_CA_BUNDLE not found | path=%s | cwd will fail TLS verify",
                ca_bundle,
            )
            raise FileNotFoundError(f"OPENAI_CA_BUNDLE not found: {ca_bundle}")

        # OS trust store + corporate CA (same idea as browsers / VS Code + extra root)
        ctx = truststore.SSLContext(ssl.PROTOCOL_TLS_CLIENT)
        ctx.load_verify_locations(cafile=str(path))
        logger.info(
            "TLS verify via system trust store + CA bundle | path=%s",
            path,
        )
        return ctx

    ctx = truststore.SSLContext(ssl.PROTOCOL_TLS_CLIENT)
    logger.info("TLS verify via system trust store (truststore / like VS Code)")
    return ctx


def build_async_http_client(settings: Settings, **kwargs: Any) -> httpx.AsyncClient:
    verify = build_ssl_context(settings)
    return httpx.AsyncClient(verify=verify, follow_redirects=True, **kwargs)
