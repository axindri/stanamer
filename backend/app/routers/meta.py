from fastapi import APIRouter

from app.schemas import ENTITY_TYPE_LABELS, EntityType, MetaItem

router = APIRouter(prefix="/v1/meta", tags=["meta"])


@router.get("/entity-types", response_model=list[MetaItem])
async def list_entity_types() -> list[MetaItem]:
    return [
        MetaItem(value=item.value, label=ENTITY_TYPE_LABELS[item])
        for item in EntityType
    ]
