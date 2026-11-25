import {
  DEFAULT_MAX_NAME_LENGTH,
  MAX_MAX_NAME_LENGTH,
  MIN_MAX_NAME_LENGTH,
} from "@/lib/constants"

export {
  DEFAULT_MAX_NAME_LENGTH,
  MAX_MAX_NAME_LENGTH,
  MIN_MAX_NAME_LENGTH,
} from "@/lib/constants"

export function clampMaxNameLength(value: number): number {
  if (!Number.isFinite(value)) {
    return DEFAULT_MAX_NAME_LENGTH
  }
  return Math.min(
    MAX_MAX_NAME_LENGTH,
    Math.max(MIN_MAX_NAME_LENGTH, Math.round(value))
  )
}
