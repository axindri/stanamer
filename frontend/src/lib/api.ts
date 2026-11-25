export type MetaItem = {
  value: string
  label: string
}

export type EntityTypeMetaItem = MetaItem & {
  default_style: string
}

export type NamingStyleMetaItem = MetaItem & {
  example: string
}

export type LlmConfigMeta = {
  base_url: string
  model: string
}

export type NameSuggestion = {
  name: string
  rationale: string
}

export type NamingResponse = {
  entity_type: string
  style: string
  suggestions: NameSuggestion[]
}

export type NamingRequestPayload = {
  entity_type: string
  description: string
  context?: string | null
  context_url?: string | null
  style?: string | null
  count?: number
  max_length?: number
  prefer_short?: boolean
  allow_digits?: boolean
  name_prefix?: string | null
  name_postfix?: string | null
}

async function readError(response: Response): Promise<string> {
  try {
    const data = (await response.json()) as { detail?: unknown }
    if (typeof data.detail === "string") {
      return data.detail
    }
    if (Array.isArray(data.detail)) {
      return data.detail
        .map((item) =>
          typeof item === "object" && item && "msg" in item
            ? String((item as { msg: unknown }).msg)
            : JSON.stringify(item)
        )
        .join("; ")
    }
  } catch {
    // ignore JSON parse errors
  }
  return `HTTP ${response.status}`
}

export async function fetchEntityTypes(): Promise<EntityTypeMetaItem[]> {
  const response = await fetch("/api/v1/meta/entity-types")
  if (!response.ok) {
    throw new Error(await readError(response))
  }
  return response.json() as Promise<EntityTypeMetaItem[]>
}

export async function fetchNamingStyles(): Promise<NamingStyleMetaItem[]> {
  const response = await fetch("/api/v1/meta/naming-styles")
  if (!response.ok) {
    throw new Error(await readError(response))
  }
  return response.json() as Promise<NamingStyleMetaItem[]>
}

export async function fetchLlmConfig(): Promise<LlmConfigMeta> {
  const response = await fetch("/api/v1/meta/llm")
  if (!response.ok) {
    throw new Error(await readError(response))
  }
  return response.json() as Promise<LlmConfigMeta>
}

export async function generateNames(
  payload: NamingRequestPayload
): Promise<NamingResponse> {
  const response = await fetch("/api/v1/naming/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
  if (!response.ok) {
    throw new Error(await readError(response))
  }
  return response.json() as Promise<NamingResponse>
}
