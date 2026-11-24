from fastapi import APIRouter

from app.schemas import ContextUrlRequest, ContextUrlResponse
from app.services.context_fetch import fetch_raw_context

router = APIRouter(prefix="/v1/context", tags=["context"])


@router.post("/from-url", response_model=ContextUrlResponse)
async def context_from_url(body: ContextUrlRequest) -> ContextUrlResponse:
    content, source = await fetch_raw_context(body.url)
    return ContextUrlResponse(content=content, source=source)
