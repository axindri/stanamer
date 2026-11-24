import { useEffect, useRef, useState } from "react"
import { Loader2Icon, SparklesIcon } from "lucide-react"
import { toast } from "sonner"

import {
  ContextField,
  type ContextMode,
} from "@/components/context-field"
import { EntityTypeField } from "@/components/entity-type-field"
import { HistoryList } from "@/components/history-list"
import { NameLengthField } from "@/components/name-length-field"
import { NamingStyleField } from "@/components/naming-style-field"
import { SuggestionList } from "@/components/suggestion-list"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  type MetaItem,
  type NameSuggestion,
  fetchEntityTypes,
  generateNames,
} from "@/lib/api"
import {
  type NamingHistoryEntry,
  clearHistory,
  loadHistory,
  pushHistoryEntry,
  updateHistoryEntryStyle,
} from "@/lib/history"
import { DEFAULT_MAX_NAME_LENGTH } from "@/lib/name-length"
import {
  DEFAULT_NAMING_STYLE,
  type NamingStyle,
  applyNamingStyle,
} from "@/lib/style"

type AppTab = "generate" | "history"

export function NamingPage() {
  const [entityTypes, setEntityTypes] = useState<MetaItem[]>([])
  const [metaLoading, setMetaLoading] = useState(true)
  const [metaReady, setMetaReady] = useState(false)

  const [entityType, setEntityType] = useState("table")
  const [namingStyle, setNamingStyle] =
    useState<NamingStyle>(DEFAULT_NAMING_STYLE)
  const [maxNameLength, setMaxNameLength] = useState(DEFAULT_MAX_NAME_LENGTH)
  const [description, setDescription] = useState("")
  const [contextMode, setContextMode] = useState<ContextMode>("manual")
  const [context, setContext] = useState("")
  const [contextUrl, setContextUrl] = useState("")

  const [loading, setLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<NameSuggestion[] | null>(null)
  const [resultsStyle, setResultsStyle] =
    useState<NamingStyle>(DEFAULT_NAMING_STYLE)
  const [scrollToken, setScrollToken] = useState(0)
  const [history, setHistory] = useState<NamingHistoryEntry[]>([])
  const [tab, setTab] = useState<AppTab>("generate")
  const resultsRef = useRef<HTMLElement>(null)

  useEffect(() => {
    setHistory(loadHistory())
    setSuggestions(null)
  }, [])

  useEffect(() => {
    if (scrollToken === 0 || tab !== "generate") {
      return
    }
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }, [scrollToken, suggestions, tab])

  useEffect(() => {
    let cancelled = false

    async function loadMeta() {
      setMetaLoading(true)
      setMetaReady(false)
      try {
        const entities = await fetchEntityTypes()
        if (cancelled) {
          return
        }
        setEntityTypes(entities)
        if (entities[0]) {
          setEntityType(entities[0].value)
        }
        setMetaReady(true)
      } catch (err) {
        if (!cancelled) {
          toast.error(
            err instanceof Error
              ? err.message
              : "Не удалось загрузить метаданные"
          )
        }
      } finally {
        if (!cancelled) {
          setMetaLoading(false)
        }
      }
    }

    void loadMeta()
    return () => {
      cancelled = true
    }
  }, [])

  const entityLabels = Object.fromEntries(
    entityTypes.map((item) => [item.value, item.label])
  )

  function handleResultsStyleChange(style: NamingStyle) {
    setResultsStyle(style)
    setSuggestions((current) =>
      current
        ? current.map((item) => ({
            ...item,
            name: applyNamingStyle(item.name, style),
          }))
        : current
    )
  }

  function handleHistoryStyleChange(entryId: string, style: NamingStyle) {
    setHistory((current) => updateHistoryEntryStyle(current, entryId, style))
  }

  function handleClearHistory() {
    clearHistory()
    setHistory([])
    toast.success("История очищена")
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmed = description.trim()
    if (trimmed.length < 3) {
      toast.warning("Описание должно быть не короче 3 символов")
      return
    }

    if (contextMode === "url" && !contextUrl.trim()) {
      toast.warning("Укажите ссылку на файл контекста")
      return
    }

    setLoading(true)
    try {
      const contextValue =
        contextMode === "url" ? null : context.trim() || null
      const contextUrlValue =
        contextMode === "url" ? contextUrl.trim() : null
      const result = await generateNames({
        entity_type: entityType,
        description: trimmed,
        context: contextValue,
        context_url: contextUrlValue,
        style: namingStyle,
        count: 5,
        max_length: maxNameLength,
      })
      const nextHistory = pushHistoryEntry(history, {
        entityType,
        style: namingStyle,
        description: trimmed,
        context: contextUrlValue ?? contextValue,
        suggestions: result.suggestions,
      })
      setHistory(nextHistory)
      setResultsStyle(namingStyle)
      setSuggestions(result.suggestions)
      setScrollToken((token) => token + 1)
    } catch (err) {
      setSuggestions(null)
      toast.error(err instanceof Error ? err.message : "Ошибка генерации")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-6 py-12">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-medium tracking-tight">
            Нейминг сущностей
          </h1>
          <p className="text-muted-foreground">
            Опишите сущность — получите варианты имён для таблиц, колонок, DAG и
            других объектов.
          </p>
        </div>

        <Tabs
          value={tab}
          onValueChange={(value) => {
            if (value === "generate" || value === "history") {
              setTab(value)
            }
          }}
          className="w-full gap-6"
        >
          <TabsList className="w-full">
            <TabsTrigger value="generate" className="flex-1">
              Генерация
            </TabsTrigger>
            <TabsTrigger value="history" className="flex-1">
              История
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generate" className="flex flex-col gap-8">
            <Card>
              <CardContent>
                {metaLoading ? (
                  <div className="flex flex-col gap-3">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-24 w-full" />
                  </div>
                ) : metaReady ? (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <FieldGroup>
                      <EntityTypeField
                        value={entityType}
                        onValueChange={setEntityType}
                        options={entityTypes}
                        required
                      />

                      <NamingStyleField
                        id="naming-style"
                        value={namingStyle}
                        onValueChange={setNamingStyle}
                        required
                      />

                      <NameLengthField
                        value={maxNameLength}
                        onValueChange={setMaxNameLength}
                      />

                      <Field>
                        <FieldLabel htmlFor="description">
                          <span>
                            Описание
                            <span className="text-destructive">*</span>
                          </span>
                        </FieldLabel>
                        <Textarea
                          id="description"
                          value={description}
                          onChange={(event) =>
                            setDescription(event.target.value)
                          }
                          placeholder="Например: справочник клиентов из CRM с историей изменений"
                          rows={4}
                          required
                        />
                      </Field>

                      <ContextField
                        mode={contextMode}
                        onModeChange={setContextMode}
                        value={context}
                        onValueChange={setContext}
                        url={contextUrl}
                        onUrlChange={setContextUrl}
                      />
                    </FieldGroup>

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full sm:w-auto"
                    >
                      {loading ? (
                        <Loader2Icon
                          data-icon="inline-start"
                          className="animate-spin"
                        />
                      ) : (
                        <SparklesIcon data-icon="inline-start" />
                      )}
                      Сгенерировать
                    </Button>
                  </form>
                ) : null}
              </CardContent>
            </Card>

            {suggestions ? (
              <section
                ref={resultsRef}
                id="results"
                className="flex scroll-mt-6 flex-col gap-4"
              >
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-medium">Варианты</h2>
                  <Badge variant="secondary">{suggestions.length}</Badge>
                </div>
                <NamingStyleField
                  id="results-style"
                  value={resultsStyle}
                  onValueChange={handleResultsStyleChange}
                />
                <SuggestionList suggestions={suggestions} />
              </section>
            ) : null}
          </TabsContent>

          <TabsContent value="history">
            <HistoryList
              entries={history}
              onClear={handleClearHistory}
              onStyleChange={handleHistoryStyleChange}
              entityLabels={entityLabels}
            />
          </TabsContent>
        </Tabs>
    </div>
  )
}
