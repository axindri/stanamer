from enum import Enum

from pydantic import BaseModel, Field


class EntityType(str, Enum):
    TABLE = "table"
    COLUMN = "column"
    DAG = "dag"
    TOPIC = "topic"
    METRIC = "metric"
    SCHEMA = "schema"
    FUNCTION = "function"


class NamingStyle(str, Enum):
    SNAKE_CASE = "snake_case"
    CAMEL_CASE = "camelCase"
    PASCAL_CASE = "PascalCase"
    KEBAB_CASE = "kebab-case"


ENTITY_TYPE_LABELS: dict[EntityType, str] = {
    EntityType.TABLE: "Таблица",
    EntityType.COLUMN: "Колонка / поле",
    EntityType.DAG: "DAG / пайплайн",
    EntityType.TOPIC: "Топик (Kafka и т.п.)",
    EntityType.METRIC: "Метрика",
    EntityType.SCHEMA: "Схема / namespace",
    EntityType.FUNCTION: "Функция",
}


class MetaItem(BaseModel):
    value: str
    label: str


DEFAULT_MAX_NAME_LENGTH = 40


class NamingRequest(BaseModel):
    entity_type: EntityType
    description: str = Field(..., min_length=3, max_length=2000)
    context: str | None = Field(default=None, max_length=8000)
    context_url: str | None = Field(
        default=None,
        max_length=2000,
        description="HTTPS git raw/blob URL; fetched at request time",
    )
    style: NamingStyle = NamingStyle.SNAKE_CASE
    count: int = Field(default=5, ge=1, le=10)
    max_length: int = Field(
        default=DEFAULT_MAX_NAME_LENGTH,
        ge=8,
        le=80,
        description="Maximum length of each suggested name",
    )


class ContextUrlRequest(BaseModel):
    url: str = Field(..., min_length=8, max_length=2000)


class ContextUrlResponse(BaseModel):
    content: str
    source: str


class NameSuggestion(BaseModel):
    name: str
    rationale: str


class NamingResponse(BaseModel):
    entity_type: EntityType
    suggestions: list[NameSuggestion]
