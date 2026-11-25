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

NAMING_STYLE_LABELS: dict[NamingStyle, str] = {
    NamingStyle.SNAKE_CASE: "snake_case",
    NamingStyle.CAMEL_CASE: "camelCase",
    NamingStyle.PASCAL_CASE: "PascalCase",
    NamingStyle.KEBAB_CASE: "kebab-case",
}

NAMING_STYLE_EXAMPLES: dict[NamingStyle, str] = {
    NamingStyle.SNAKE_CASE: "dim_customer_orders",
    NamingStyle.CAMEL_CASE: "dimCustomerOrders",
    NamingStyle.PASCAL_CASE: "DimCustomerOrders",
    NamingStyle.KEBAB_CASE: "dim-customer-orders",
}

ENTITY_DEFAULT_STYLES: dict[EntityType, NamingStyle] = {
    EntityType.TABLE: NamingStyle.SNAKE_CASE,
    EntityType.COLUMN: NamingStyle.SNAKE_CASE,
    EntityType.DAG: NamingStyle.SNAKE_CASE,
    EntityType.TOPIC: NamingStyle.KEBAB_CASE,
    EntityType.METRIC: NamingStyle.SNAKE_CASE,
    EntityType.SCHEMA: NamingStyle.SNAKE_CASE,
    EntityType.FUNCTION: NamingStyle.SNAKE_CASE,
}


class MetaItem(BaseModel):
    value: str
    label: str


class EntityTypeMetaItem(BaseModel):
    value: str
    label: str
    default_style: str


class NamingStyleMetaItem(BaseModel):
    value: str
    label: str
    example: str


class LlmConfigMeta(BaseModel):
    base_url: str
    model: str


DEFAULT_MAX_NAME_LENGTH = 40
DEFAULT_SUGGESTION_COUNT = 5


class NamingRequest(BaseModel):
    entity_type: EntityType
    description: str = Field(..., min_length=5, max_length=2000)
    context: str | None = Field(default=None, max_length=8000)
    context_url: str | None = Field(
        default=None,
        max_length=2000,
        description="HTTPS git raw/blob URL; fetched at request time",
    )
    style: NamingStyle | None = Field(
        default=None,
        description="If omitted, backend picks default style for entity_type",
    )
    count: int = Field(default=DEFAULT_SUGGESTION_COUNT, ge=3, le=7)
    max_length: int = Field(
        default=DEFAULT_MAX_NAME_LENGTH,
        ge=8,
        le=80,
        description="Maximum length of each suggested name",
    )
    prefer_short: bool = Field(
        default=False,
        description="Prefer shorter identifiers within max_length",
    )
    allow_digits: bool = Field(
        default=True,
        description="Allow digits in suggested names",
    )
    name_prefix: str | None = Field(
        default=None,
        max_length=8,
        description="Optional fixed prefix for all suggestions (e.g. stg_)",
    )
    name_postfix: str | None = Field(
        default=None,
        max_length=8,
        description="Optional fixed postfix for all suggestions (e.g. _v1)",
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
    style: NamingStyle
    suggestions: list[NameSuggestion]
