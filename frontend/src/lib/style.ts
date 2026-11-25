export type NamingStyle =
  | "snake_case"
  | "camelCase"
  | "PascalCase"
  | "kebab-case"

export const DEFAULT_NAMING_STYLE: NamingStyle = "snake_case"

const KNOWN_STYLES: NamingStyle[] = [
  "snake_case",
  "camelCase",
  "PascalCase",
  "kebab-case",
]

export function isNamingStyle(value: unknown): value is NamingStyle {
  return typeof value === "string" && KNOWN_STYLES.includes(value as NamingStyle)
}

const CAMEL_BOUNDARY =
  /(?<=[a-z0-9])(?=[A-Z])|(?<=[A-Z])(?=[A-Z][a-z])/g
const SPLIT_SEP = /[_\-\s]+/

function tokens(part: string): string[] {
  const text = part.trim()
  if (!text) {
    return []
  }
  const spaced = text.replace(CAMEL_BOUNDARY, " ")
  return spaced
    .split(SPLIT_SEP)
    .map((token) => token.toLowerCase())
    .filter(Boolean)
}

function joinTokens(parts: string[], style: NamingStyle): string {
  if (parts.length === 0) {
    return ""
  }
  if (style === "snake_case") {
    return parts.join("_")
  }
  if (style === "kebab-case") {
    return parts.join("-")
  }
  if (style === "camelCase") {
    const [first, ...rest] = parts
    return (
      first +
      rest
        .map((token) => token.charAt(0).toUpperCase() + token.slice(1))
        .join("")
    )
  }
  return parts
    .map((token) => token.charAt(0).toUpperCase() + token.slice(1))
    .join("")
}

export function applyNamingStyle(name: string, style: NamingStyle): string {
  return name
    .split(".")
    .map((segment) => joinTokens(tokens(segment), style))
    .filter(Boolean)
    .join(".")
}
