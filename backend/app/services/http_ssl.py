from __future__ import annotations

import ssl
from typing import Any

import httpx
import truststore

from app.config import Settings


def build_async_http_client(settings: Settings, **kwargs: Any) -> httpx.AsyncClient:
    # truststore = OS certs (like VS Code). Set OPENAI_VERIFY_SSL=false to skip verify.
    verify: bool | ssl.SSLContext = (
        False
        if not settings.openai_verify_ssl
        else truststore.SSLContext(ssl.PROTOCOL_TLS_CLIENT)
    )
    return httpx.AsyncClient(verify=verify, follow_redirects=True, **kwargs)
