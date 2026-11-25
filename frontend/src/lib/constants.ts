/** App version injected at build time from package.json */
export const APP_VERSION = __APP_VERSION__

/** Routes */
export const NAV_ITEMS = [
  { to: "/naming", label: "Нейминг" },
  { to: "/dev", label: "Разработка" },
  { to: "/terms", label: "Соглашение" },
] as const

/** API paths */
export const API_GENERATE_PATH = "/api/v1/naming/generate"
export const API_ENTITY_TYPES_PATH = "/api/v1/meta/entity-types"
export const API_NAMING_STYLES_PATH = "/api/v1/meta/naming-styles"
export const API_LLM_CONFIG_PATH = "/api/v1/meta/llm"

/** Description */
export const MIN_DESCRIPTION_LENGTH = 3
export const MAX_DESCRIPTION_LENGTH = 2000

/** Suggestion count */
export const DEFAULT_SUGGESTION_COUNT = 5
export const MIN_SUGGESTION_COUNT = 3
export const MAX_SUGGESTION_COUNT = 7
export const SUGGESTION_COUNT_OPTIONS = [3, 4, 5, 6, 7] as const

/** Max name length */
export const DEFAULT_MAX_NAME_LENGTH = 40
export const MIN_MAX_NAME_LENGTH = 8
export const MAX_MAX_NAME_LENGTH = 80

/** Prefix / postfix */
export const MAX_NAME_AFFIX_LENGTH = 8

/** Naming style */
export const DEFAULT_NAMING_STYLE = "snake_case" as const
export const NAMING_STYLES = [
  "snake_case",
  "camelCase",
  "PascalCase",
  "kebab-case",
] as const

/** History */
export const HISTORY_STORAGE_KEY = "stanamer.naming-history"
export const HISTORY_LIMIT = 10

/** Optional params */
export const OPTIONAL_PARAMS_STORAGE_KEY = "stanamer.optional-params"
export const DEFAULT_PREFER_SHORT = false
export const DEFAULT_ALLOW_DIGITS = true
export const DEFAULT_NAME_PREFIX = ""
export const DEFAULT_NAME_POSTFIX = ""
export const DEFAULT_CONTEXT_MODE = "manual" as const
export const DEFAULT_CONTEXT = ""
export const DEFAULT_CONTEXT_URL = ""

/** Theme */
export const THEME_STORAGE_KEY = "theme"
export const COLOR_SCHEME_QUERY = "(prefers-color-scheme: dark)"
export const THEME_VALUES = ["dark", "light", "system"] as const
export const THEME_OPTIONS = [
  { value: "system" as const, label: "Системная" },
  { value: "light" as const, label: "Светлая" },
  { value: "dark" as const, label: "Тёмная" },
] as const
