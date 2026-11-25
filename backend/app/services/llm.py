import json
import logging
import re
from typing import Any

from fastapi import HTTPException
from openai import APIError, APIStatusError, AsyncOpenAI, APITimeoutError, APIConnectionError

from app.config import Settings
from app.schemas import NameSuggestion, NamingRequest, NamingResponse
from app.services.http_ssl import build_async_http_client
from app.services.prompts import SYSTEM_PROMPT, build_user_prompt
from app.services.style import apply_naming_style

logger = logging.getLogger(__name__)

_JSON_BLOCK_RE = re.compile(r"```(?:json)?\s*([\s\S]*?)\s*```", re.IGNORECASE)


def _truncate(value: str, limit: int = 2000) -> str:
    text = value.strip()
    if len(text) <= limit:
        return text
    return f"{text[:limit]}…(+{len(text) - limit} chars)"


def _safe_body(body: Any) -> str:
    if body is None:
        return ""
    if isinstance(body, (dict, list)):
        try:
            return _truncate(json.dumps(body, ensure_ascii=False))
        except (TypeError, ValueError):
            return _truncate(str(body))
    return _truncate(str(body))


def _extract_json_payload(content: str) -> dict:
    text = content.strip()
    match = _JSON_BLOCK_RE.search(text)
    if match:
        text = match.group(1).strip()
    try:
        data = json.loads(text)
    except json.JSONDecodeError as exc:
        logger.error(
            "LLM returned invalid JSON: %s | preview=%r",
            exc,
            _truncate(content, 500),
        )
        raise HTTPException(
            status_code=502,
            detail="Model returned invalid JSON; could not parse suggestions",
        ) from exc
    if not isinstance(data, dict):
        logger.error("LLM JSON root is not an object: %s", type(data).__name__)
        raise HTTPException(status_code=502, detail="Model JSON root must be an object")
    return data


def _parse_suggestions(data: dict, count: int) -> list[NameSuggestion]:
    error_code = data.get("error")
    if error_code:
        message = data.get("message")
        detail = (
            message.strip()
            if isinstance(message, str) and message.strip()
            else "Request is off-topic; only entity naming is supported"
        )
        raise HTTPException(status_code=400, detail=detail)

    raw = data.get("suggestions")
    if not isinstance(raw, list) or not raw:
        logger.error("LLM response missing suggestions: keys=%s", list(data.keys()))
        raise HTTPException(status_code=502, detail="Model response missing suggestions")

    suggestions: list[NameSuggestion] = []
    for item in raw:
        if not isinstance(item, dict):
            continue
        name = item.get("name")
        rationale = item.get("rationale")
        if isinstance(name, str) and isinstance(rationale, str) and name.strip():
            suggestions.append(
                NameSuggestion(name=name.strip(), rationale=rationale.strip() or "—")
            )
        if len(suggestions) >= count:
            break

    if not suggestions:
        logger.error("LLM returned no valid suggestions: payload=%s", _safe_body(data))
        raise HTTPException(status_code=502, detail="Model returned no valid suggestions")
    return suggestions


class NamingLLMService:
    def __init__(self, settings: Settings) -> None:
        self._settings = settings
        self._http_client = build_async_http_client(settings, timeout=120.0)
        self._client = AsyncOpenAI(
            base_url=settings.openai_base_url,
            api_key=settings.openai_api_key or "missing-key",
            http_client=self._http_client,
        )

    def _request_context(self, request: NamingRequest) -> dict[str, Any]:
        return {
            "base_url": self._settings.openai_base_url,
            "model": self._settings.openai_model,
            "verify_ssl": self._settings.openai_verify_ssl,
            "entity_type": request.entity_type.value,
            "style": request.style.value if request.style else None,
            "count": request.count,
            "max_length": request.max_length,
            "description_len": len(request.description or ""),
            "context_len": len(request.context or ""),
            "has_context_url": bool(request.context_url),
        }

    def _log_api_error(self, request: NamingRequest, exc: Exception) -> str:
        ctx = self._request_context(request)
        status = getattr(exc, "status_code", None)
        request_id = getattr(exc, "request_id", None)
        code = getattr(exc, "code", None)
        err_type = getattr(exc, "type", None)
        body = getattr(exc, "body", None)
        message = getattr(exc, "message", None) or str(exc)

        detail_parts = [
            f"type={exc.__class__.__name__}",
            f"message={message}",
        ]
        if status is not None:
            detail_parts.append(f"status={status}")
        if request_id:
            detail_parts.append(f"request_id={request_id}")
        if code:
            detail_parts.append(f"code={code}")
        if err_type:
            detail_parts.append(f"error_type={err_type}")

        logger.error(
            "Upstream LLM call failed | %s | ctx=%s | body=%s",
            " ".join(detail_parts),
            ctx,
            _safe_body(body),
            exc_info=True,
        )

        # Keep toast/API detail useful but compact (no secrets).
        public = f"Upstream LLM error ({exc.__class__.__name__})"
        if status is not None:
            public += f" HTTP {status}"
        if message:
            public += f": {_truncate(str(message), 300)}"
        if request_id:
            public += f" [request_id={request_id}]"
        return public

    async def generate(self, request: NamingRequest) -> NamingResponse:
        if not self._settings.openai_api_key:
            raise HTTPException(
                status_code=503,
                detail="OPENAI_API_KEY is not configured",
            )

        ctx = self._request_context(request)
        logger.info("LLM generate start | %s", ctx)

        try:
            completion = await self._client.chat.completions.create(
                model=self._settings.openai_model,
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": build_user_prompt(request)},
                ],
                temperature=0.2,
            )
        except (APIStatusError, APITimeoutError, APIConnectionError, APIError) as exc:
            detail = self._log_api_error(request, exc)
            raise HTTPException(status_code=502, detail=detail) from exc
        except Exception as exc:  # noqa: BLE001
            detail = self._log_api_error(request, exc)
            raise HTTPException(status_code=502, detail=detail) from exc

        content = completion.choices[0].message.content if completion.choices else None
        if not content:
            logger.error(
                "Empty LLM response | ctx=%s | finish_reason=%s",
                ctx,
                getattr(completion.choices[0], "finish_reason", None)
                if completion.choices
                else None,
            )
            raise HTTPException(status_code=502, detail="Empty response from model")

        logger.info(
            "LLM generate raw response | model=%s | chars=%s | preview=%r",
            self._settings.openai_model,
            len(content),
            _truncate(content, 240),
        )

        payload = _extract_json_payload(content)
        style = request.style
        if style is None:
            from app.schemas import ENTITY_DEFAULT_STYLES

            style = ENTITY_DEFAULT_STYLES[request.entity_type]

        suggestions = [
            NameSuggestion(
                name=apply_naming_style(item.name, style),
                rationale=item.rationale,
            )
            for item in _parse_suggestions(payload, request.count)
        ]
        logger.info(
            "LLM generate ok | suggestions=%s | names=%s",
            len(suggestions),
            [item.name for item in suggestions],
        )
        return NamingResponse(
            entity_type=request.entity_type,
            style=style,
            suggestions=suggestions,
        )
