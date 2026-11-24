from __future__ import annotations

import ipaddress
import logging
import re
import socket
from urllib.parse import urlparse

import httpx
from fastapi import HTTPException

from app.config import get_settings
from app.services.http_ssl import build_async_http_client

logger = logging.getLogger(__name__)

MAX_CONTEXT_BYTES = 8000
FETCH_TIMEOUT_SECONDS = 15.0

_GITHUB_BLOB_RE = re.compile(
    r"^https://github\.com/(?P<owner>[^/]+)/(?P<repo>[^/]+)/blob/(?P<rest>.+)$"
)
_GITLAB_BLOB_RE = re.compile(
    r"^(?P<base>https://[^/]+)/(?P<path>.+)/-/blob/(?P<rest>.+)$"
)


def normalize_git_raw_url(url: str) -> str:
    cleaned = url.strip()
    github = _GITHUB_BLOB_RE.match(cleaned)
    if github:
        owner = github.group("owner")
        repo = github.group("repo")
        rest = github.group("rest")
        return f"https://raw.githubusercontent.com/{owner}/{repo}/{rest}"

    gitlab = _GITLAB_BLOB_RE.match(cleaned)
    if gitlab:
        return f"{gitlab.group('base')}/{gitlab.group('path')}/-/raw/{gitlab.group('rest')}"

    return cleaned


def _assert_safe_url(url: str) -> None:
    parsed = urlparse(url)
    if parsed.scheme != "https":
        raise HTTPException(status_code=400, detail="Разрешены только HTTPS-ссылки")
    if not parsed.hostname:
        raise HTTPException(status_code=400, detail="Некорректный URL")

    hostname = parsed.hostname
    try:
        infos = socket.getaddrinfo(hostname, None)
    except socket.gaierror as exc:
        raise HTTPException(
            status_code=400, detail="Не удалось разрешить хост URL"
        ) from exc

    for info in infos:
        ip_str = info[4][0]
        try:
            ip = ipaddress.ip_address(ip_str)
        except ValueError:
            continue
        if (
            ip.is_private
            or ip.is_loopback
            or ip.is_link_local
            or ip.is_reserved
            or ip.is_multicast
        ):
            raise HTTPException(
                status_code=400, detail="URL указывает на недопустимый хост"
            )


async def fetch_raw_context(url: str) -> tuple[str, str]:
    source = normalize_git_raw_url(url)
    _assert_safe_url(source)

    logger.info("Fetching context URL | source=%s", source)
    try:
        async with build_async_http_client(
            get_settings(),
            timeout=FETCH_TIMEOUT_SECONDS,
        ) as client:
            response = await client.get(source)
    except httpx.HTTPError as exc:
        logger.error(
            "Context URL fetch failed | source=%s | error=%s",
            source,
            exc,
            exc_info=True,
        )
        raise HTTPException(
            status_code=502, detail=f"Не удалось загрузить файл по ссылке: {exc}"
        ) from exc

    if response.status_code >= 400:
        logger.error(
            "Context URL HTTP error | source=%s | status=%s | body=%r",
            source,
            response.status_code,
            response.text[:500],
        )
        raise HTTPException(
            status_code=502,
            detail=f"Источник ответил HTTP {response.status_code}",
        )

    content_type = response.headers.get("content-type", "")
    if content_type and not any(
        token in content_type
        for token in ("text/", "json", "xml", "yaml", "octet-stream")
    ):
        raise HTTPException(
            status_code=400, detail="По ссылке лежит не текстовый файл"
        )

    raw = response.content[: MAX_CONTEXT_BYTES + 1]
    if len(raw) > MAX_CONTEXT_BYTES:
        raise HTTPException(
            status_code=400,
            detail=f"Файл слишком большой (лимит {MAX_CONTEXT_BYTES} байт)",
        )

    try:
        text = raw.decode("utf-8")
    except UnicodeDecodeError as exc:
        raise HTTPException(
            status_code=400, detail="Файл должен быть в UTF-8"
        ) from exc

    return text, source
