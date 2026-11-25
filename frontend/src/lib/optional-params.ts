import type { ContextMode } from "@/components/context-field"
import {
  DEFAULT_SUGGESTION_COUNT,
  MAX_SUGGESTION_COUNT,
  MIN_SUGGESTION_COUNT,
} from "@/components/suggestion-count-field"
import {
  clampMaxNameLength,
  DEFAULT_MAX_NAME_LENGTH,
} from "@/lib/name-length"

export const OPTIONAL_PARAMS_STORAGE_KEY = "stanamer.optional-params"
export const MAX_NAME_AFFIX_LENGTH = 8

export type OptionalNamingParamsState = {
  suggestionCount: number
  maxNameLength: number
  preferShort: boolean
  allowDigits: boolean
  namePrefix: string
  namePostfix: string
  contextMode: ContextMode
  context: string
  contextUrl: string
}

export const DEFAULT_OPTIONAL_PARAMS: OptionalNamingParamsState = {
  suggestionCount: DEFAULT_SUGGESTION_COUNT,
  maxNameLength: DEFAULT_MAX_NAME_LENGTH,
  preferShort: false,
  allowDigits: true,
  namePrefix: "",
  namePostfix: "",
  contextMode: "manual",
  context: "",
  contextUrl: "",
}

function isContextMode(value: unknown): value is ContextMode {
  return value === "manual" || value === "file" || value === "url"
}

function clampAffix(value: string): string {
  return value.slice(0, MAX_NAME_AFFIX_LENGTH)
}

function normalizeOptionalParams(
  value: Partial<OptionalNamingParamsState> | null | undefined
): OptionalNamingParamsState {
  const suggestionCount =
    typeof value?.suggestionCount === "number" &&
    Number.isInteger(value.suggestionCount) &&
    value.suggestionCount >= MIN_SUGGESTION_COUNT &&
    value.suggestionCount <= MAX_SUGGESTION_COUNT
      ? value.suggestionCount
      : DEFAULT_OPTIONAL_PARAMS.suggestionCount

  return {
    suggestionCount,
    maxNameLength:
      typeof value?.maxNameLength === "number"
        ? clampMaxNameLength(value.maxNameLength)
        : DEFAULT_OPTIONAL_PARAMS.maxNameLength,
    preferShort:
      typeof value?.preferShort === "boolean"
        ? value.preferShort
        : DEFAULT_OPTIONAL_PARAMS.preferShort,
    allowDigits:
      typeof value?.allowDigits === "boolean"
        ? value.allowDigits
        : DEFAULT_OPTIONAL_PARAMS.allowDigits,
    namePrefix:
      typeof value?.namePrefix === "string"
        ? clampAffix(value.namePrefix)
        : DEFAULT_OPTIONAL_PARAMS.namePrefix,
    namePostfix:
      typeof value?.namePostfix === "string"
        ? clampAffix(value.namePostfix)
        : DEFAULT_OPTIONAL_PARAMS.namePostfix,
    contextMode: isContextMode(value?.contextMode)
      ? value.contextMode
      : DEFAULT_OPTIONAL_PARAMS.contextMode,
    context:
      typeof value?.context === "string"
        ? value.context
        : DEFAULT_OPTIONAL_PARAMS.context,
    contextUrl:
      typeof value?.contextUrl === "string"
        ? value.contextUrl
        : DEFAULT_OPTIONAL_PARAMS.contextUrl,
  }
}

export function loadOptionalParams(): OptionalNamingParamsState {
  try {
    const raw = localStorage.getItem(OPTIONAL_PARAMS_STORAGE_KEY)
    if (!raw) {
      return { ...DEFAULT_OPTIONAL_PARAMS }
    }
    const parsed: unknown = JSON.parse(raw)
    if (!parsed || typeof parsed !== "object") {
      return { ...DEFAULT_OPTIONAL_PARAMS }
    }
    return normalizeOptionalParams(parsed as Partial<OptionalNamingParamsState>)
  } catch {
    return { ...DEFAULT_OPTIONAL_PARAMS }
  }
}

export function saveOptionalParams(state: OptionalNamingParamsState): void {
  localStorage.setItem(OPTIONAL_PARAMS_STORAGE_KEY, JSON.stringify(state))
}

export function clearOptionalParams(): void {
  localStorage.removeItem(OPTIONAL_PARAMS_STORAGE_KEY)
}

export function isOptionalParamsModified(
  state: OptionalNamingParamsState
): boolean {
  return (
    state.suggestionCount !== DEFAULT_OPTIONAL_PARAMS.suggestionCount ||
    state.maxNameLength !== DEFAULT_OPTIONAL_PARAMS.maxNameLength ||
    state.preferShort !== DEFAULT_OPTIONAL_PARAMS.preferShort ||
    state.allowDigits !== DEFAULT_OPTIONAL_PARAMS.allowDigits ||
    state.namePrefix.trim() !== DEFAULT_OPTIONAL_PARAMS.namePrefix ||
    state.namePostfix.trim() !== DEFAULT_OPTIONAL_PARAMS.namePostfix ||
    state.contextMode !== DEFAULT_OPTIONAL_PARAMS.contextMode ||
    state.context.trim() !== DEFAULT_OPTIONAL_PARAMS.context ||
    state.contextUrl.trim() !== DEFAULT_OPTIONAL_PARAMS.contextUrl
  )
}
