export const DEFAULT_MAX_NAME_LENGTH = 40
export const MIN_MAX_NAME_LENGTH = 8
export const MAX_MAX_NAME_LENGTH = 80

export function clampMaxNameLength(value: number): number {
  if (!Number.isFinite(value)) {
    return DEFAULT_MAX_NAME_LENGTH
  }
  return Math.min(
    MAX_MAX_NAME_LENGTH,
    Math.max(MIN_MAX_NAME_LENGTH, Math.round(value))
  )
}
