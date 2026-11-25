from fastapi import APIRouter

from app.config import get_settings
from app.schemas import (
    ENTITY_DEFAULT_STYLES,
    ENTITY_TYPE_LABELS,
    NAMING_STYLE_EXAMPLES,
    NAMING_STYLE_LABELS,
    EntityType,
    EntityTypeMetaItem,
    LlmConfigMeta,
    NamingStyle,
    NamingStyleMetaItem,
)

router = APIRouter(prefix="/v1/meta", tags=["meta"])


@router.get("/entity-types", response_model=list[EntityTypeMetaItem])
async def list_entity_types() -> list[EntityTypeMetaItem]:
    return [
        EntityTypeMetaItem(
            value=item.value,
            label=ENTITY_TYPE_LABELS[item],
            default_style=ENTITY_DEFAULT_STYLES[item].value,
        )
        for item in EntityType
    ]


@router.get("/naming-styles", response_model=list[NamingStyleMetaItem])
async def list_naming_styles() -> list[NamingStyleMetaItem]:
    return [
        NamingStyleMetaItem(
            value=item.value,
            label=NAMING_STYLE_LABELS[item],
            example=NAMING_STYLE_EXAMPLES[item],
        )
        for item in NamingStyle
    ]


@router.get("/llm", response_model=LlmConfigMeta)
async def get_llm_config() -> LlmConfigMeta:
    settings = get_settings()
    return LlmConfigMeta(
        base_url=settings.openai_base_url,
        model=settings.openai_model,
    )
