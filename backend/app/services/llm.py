import json
import re

from fastapi import HTTPException
from openai import APIError, AsyncOpenAI

from app.config import Settings
from app.schemas import NameSuggestion, NamingRequest, NamingResponse
from app.services.prompts import SYSTEM_PROMPT, build_user_prompt
from app.services.style import apply_naming_style

_JSON_BLOCK_RE = re.compile(r"```(?:json)?\s*([\s\S]*?)\s*```", re.IGNORECASE)


def _extract_json_payload(content: str) -> dict:
    text = content.strip()
    match = _JSON_BLOCK_RE.search(text)
    if match:
        text = match.group(1).strip()
    try:
        data = json.loads(text)
    except json.JSONDecodeError as exc:
        raise HTTPException(
            status_code=502,
            detail="Model returned invalid JSON; could not parse suggestions",
        ) from exc
    if not isinstance(data, dict):
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
        raise HTTPException(status_code=502, detail="Model returned no valid suggestions")
    return suggestions


class NamingLLMService:
    def __init__(self, settings: Settings) -> None:
        self._settings = settings
        self._client = AsyncOpenAI(
            base_url=settings.openai_base_url,
            api_key=settings.openai_api_key or "missing-key",
        )

    async def generate(self, request: NamingRequest) -> NamingResponse:
        if not self._settings.openai_api_key:
            raise HTTPException(
                status_code=503,
                detail="OPENAI_API_KEY is not configured",
            )

        try:
            completion = await self._client.chat.completions.create(
                model=self._settings.openai_model,
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": build_user_prompt(request)},
                ],
                temperature=0.2,
            )
        except APIError as exc:
            raise HTTPException(
                status_code=502,
                detail=f"Upstream LLM error: {exc.message or exc.__class__.__name__}",
            ) from exc
        except Exception as exc:  # noqa: BLE001
            raise HTTPException(
                status_code=502,
                detail=f"Failed to call LLM: {exc.__class__.__name__}",
            ) from exc

        content = completion.choices[0].message.content if completion.choices else None
        if not content:
            raise HTTPException(status_code=502, detail="Empty response from model")

        payload = _extract_json_payload(content)
        suggestions = [
            NameSuggestion(
                name=apply_naming_style(item.name, request.style),
                rationale=item.rationale,
            )
            for item in _parse_suggestions(payload, request.count)
        ]
        return NamingResponse(
            entity_type=request.entity_type,
            suggestions=suggestions,
        )
