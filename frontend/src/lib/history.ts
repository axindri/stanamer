import type { NameSuggestion } from "@/lib/api"
import {
  type NamingStyle,
  applyNamingStyle,
  isNamingStyle,
} from "@/lib/style"

export const HISTORY_STORAGE_KEY = "stanamer.naming-history"
export const HISTORY_LIMIT = 3

export type NamingHistoryEntry = {
  id: string
  createdAt: string
  entityType: string
  style: NamingStyle
  description: string
  context: string | null
  suggestions: NameSuggestion[]
}

function isHistoryEntry(value: unknown): value is NamingHistoryEntry {
  if (!value || typeof value !== "object") {
    return false
  }
  const entry = value as NamingHistoryEntry
  return (
    typeof entry.id === "string" &&
    typeof entry.createdAt === "string" &&
    typeof entry.entityType === "string" &&
    isNamingStyle(entry.style) &&
    typeof entry.description === "string" &&
    Array.isArray(entry.suggestions)
  )
}

export function loadHistory(): NamingHistoryEntry[] {
  try {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY)
    if (!raw) {
      return []
    }
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) {
      return []
    }
    return parsed.filter(isHistoryEntry).slice(0, HISTORY_LIMIT)
  } catch {
    return []
  }
}

export function saveHistory(entries: NamingHistoryEntry[]): void {
  localStorage.setItem(
    HISTORY_STORAGE_KEY,
    JSON.stringify(entries.slice(0, HISTORY_LIMIT))
  )
}

export function clearHistory(): void {
  localStorage.removeItem(HISTORY_STORAGE_KEY)
}

function createId(): string {
  const c = globalThis.crypto
  if (c && typeof c.randomUUID === "function") {
    return c.randomUUID()
  }
  // Fallback for non-secure origins (http://host:port) where randomUUID is missing
  if (c && typeof c.getRandomValues === "function") {
    const bytes = new Uint8Array(16)
    c.getRandomValues(bytes)
    bytes[6] = (bytes[6] & 0x0f) | 0x40
    bytes[8] = (bytes[8] & 0x3f) | 0x80
    const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("")
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
  }
  return `id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

export function pushHistoryEntry(
  current: NamingHistoryEntry[],
  entry: Omit<NamingHistoryEntry, "id" | "createdAt">
): NamingHistoryEntry[] {
  const next: NamingHistoryEntry[] = [
    {
      ...entry,
      id: createId(),
      createdAt: new Date().toISOString(),
    },
    ...current,
  ].slice(0, HISTORY_LIMIT)
  saveHistory(next)
  return next
}

export function updateHistoryEntryStyle(
  current: NamingHistoryEntry[],
  entryId: string,
  style: NamingStyle
): NamingHistoryEntry[] {
  const next = current.map((entry) => {
    if (entry.id !== entryId) {
      return entry
    }
    return {
      ...entry,
      style,
      suggestions: entry.suggestions.map((item) => ({
        ...item,
        name: applyNamingStyle(item.name, style),
      })),
    }
  })
  saveHistory(next)
  return next
}
