from fastapi import APIRouter, Request

from app.schemas import ENTITY_DEFAULT_STYLES, NamingRequest, NamingResponse
from app.services.context_fetch import fetch_raw_context
from app.services.llm import NamingLLMService

router = APIRouter(prefix="/v1/naming", tags=["naming"])


@router.post("/generate", response_model=NamingResponse)
async def generate(body: NamingRequest, request: Request) -> NamingResponse:
    service: NamingLLMService = request.app.state.llm_service
    updates: dict = {}
    if body.context_url and body.context_url.strip():
        content, _source = await fetch_raw_context(body.context_url)
        updates["context"] = content
        updates["context_url"] = None
    if body.style is None:
        updates["style"] = ENTITY_DEFAULT_STYLES[body.entity_type]
    if updates:
        body = body.model_copy(update=updates)
    return await service.generate(body)
