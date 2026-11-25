import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { toast } from "sonner"

import { type ContextMode } from "@/components/context-field"
import { HistoryList } from "@/components/history-list"
import { NamingPromptField } from "@/components/naming-prompt-field"
import { NamingStyleField } from "@/components/naming-style-field"
import { OptionalNamingParams } from "@/components/optional-naming-params"
import { SuggestionList } from "@/components/suggestion-list"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { FieldGroup } from "@/components/ui/field"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  type EntityTypeMetaItem,
  type LlmConfigMeta,
  type NameSuggestion,
  type NamingStyleMetaItem,
  fetchEntityTypes,
  fetchLlmConfig,
  fetchNamingStyles,
  generateNames,
} from "@/lib/api"
import {
  type NamingHistoryEntry,
  clearHistory,
  loadHistory,
  pushHistoryEntry,
  updateHistoryEntryStyle,
} from "@/lib/history"
import {
  DEFAULT_OPTIONAL_PARAMS,
  clearOptionalParams,
  isOptionalParamsModified,
  loadOptionalParams,
  saveOptionalParams,
} from "@/lib/optional-params"
import {
  DEFAULT_NAMING_STYLE,
  type NamingStyle,
  applyNamingStyle,
  isNamingStyle,
} from "@/lib/style"

type AppTab = "generate" | "history"

export function NamingPage() {
  const [entityTypes, setEntityTypes] = useState<EntityTypeMetaItem[]>([])
  const [namingStyles, setNamingStyles] = useState<NamingStyleMetaItem[]>([])
  const [llmConfig, setLlmConfig] = useState<LlmConfigMeta | null>(null)
  const [metaLoading, setMetaLoading] = useState(true)
  const [metaReady, setMetaReady] = useState(false)

  const [entityType, setEntityType] = useState("table")
  const [namingStyle, setNamingStyle] =
    useState<NamingStyle>(DEFAULT_NAMING_STYLE)
  const [suggestionCount, setSuggestionCount] = useState(
    DEFAULT_OPTIONAL_PARAMS.suggestionCount
  )
  const [maxNameLength, setMaxNameLength] = useState(
    DEFAULT_OPTIONAL_PARAMS.maxNameLength
  )
  const [preferShort, setPreferShort] = useState(
    DEFAULT_OPTIONAL_PARAMS.preferShort
  )
  const [allowDigits, setAllowDigits] = useState(
    DEFAULT_OPTIONAL_PARAMS.allowDigits
  )
  const [namePrefix, setNamePrefix] = useState(
    DEFAULT_OPTIONAL_PARAMS.namePrefix
  )
  const [namePostfix, setNamePostfix] = useState(
    DEFAULT_OPTIONAL_PARAMS.namePostfix
  )
  const [description, setDescription] = useState("")
  const [contextMode, setContextMode] = useState<ContextMode>(
    DEFAULT_OPTIONAL_PARAMS.contextMode
  )
  const [context, setContext] = useState(DEFAULT_OPTIONAL_PARAMS.context)
  const [contextUrl, setContextUrl] = useState(
    DEFAULT_OPTIONAL_PARAMS.contextUrl
  )
  const [optionalParamsHydrated, setOptionalParamsHydrated] = useState(false)

  const [loading, setLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<NameSuggestion[] | null>(null)
  const [resultsStyle, setResultsStyle] =
    useState<NamingStyle>(DEFAULT_NAMING_STYLE)
  const [scrollToken, setScrollToken] = useState(0)
  const [history, setHistory] = useState<NamingHistoryEntry[]>([])
  const [tab, setTab] = useState<AppTab>("generate")
  const resultsRef = useRef<HTMLElement>(null)

  const optionalParamsModified = isOptionalParamsModified({
    suggestionCount,
    maxNameLength,
    preferShort,
    allowDigits,
    namePrefix,
    namePostfix,
    contextMode,
    context,
    contextUrl,
  })

  useEffect(() => {
    setHistory(loadHistory())
    const saved = loadOptionalParams()
    setSuggestionCount(saved.suggestionCount)
    setMaxNameLength(saved.maxNameLength)
    setPreferShort(saved.preferShort)
    setAllowDigits(saved.allowDigits)
    setNamePrefix(saved.namePrefix)
    setNamePostfix(saved.namePostfix)
    setContextMode(saved.contextMode)
    setContext(saved.context)
    setContextUrl(saved.contextUrl)
    setOptionalParamsHydrated(true)
    setSuggestions(null)
  }, [])

  useEffect(() => {
    if (!optionalParamsHydrated) {
      return
    }
    saveOptionalParams({
      suggestionCount,
      maxNameLength,
      preferShort,
      allowDigits,
      namePrefix,
      namePostfix,
      contextMode,
      context,
      contextUrl,
    })
  }, [
    optionalParamsHydrated,
    suggestionCount,
    maxNameLength,
    preferShort,
    allowDigits,
    namePrefix,
    namePostfix,
    contextMode,
    context,
    contextUrl,
  ])

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
        const [entities, styles, llm] = await Promise.all([
          fetchEntityTypes(),
          fetchNamingStyles(),
          fetchLlmConfig(),
        ])
        if (cancelled) {
          return
        }
        setEntityTypes(entities)
        setNamingStyles(styles)
        setLlmConfig(llm)
        if (entities[0]) {
          setEntityType(entities[0].value)
          if (isNamingStyle(entities[0].default_style)) {
            setNamingStyle(entities[0].default_style)
          }
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

  function handleEntityTypeChange(next: string) {
    setEntityType(next)
    const meta = entityTypes.find((item) => item.value === next)
    if (meta && isNamingStyle(meta.default_style)) {
      setNamingStyle(meta.default_style)
    }
  }

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

  function handleResetOptionalParams() {
    clearOptionalParams()
    setSuggestionCount(DEFAULT_OPTIONAL_PARAMS.suggestionCount)
    setMaxNameLength(DEFAULT_OPTIONAL_PARAMS.maxNameLength)
    setPreferShort(DEFAULT_OPTIONAL_PARAMS.preferShort)
    setAllowDigits(DEFAULT_OPTIONAL_PARAMS.allowDigits)
    setNamePrefix(DEFAULT_OPTIONAL_PARAMS.namePrefix)
    setNamePostfix(DEFAULT_OPTIONAL_PARAMS.namePostfix)
    setContextMode(DEFAULT_OPTIONAL_PARAMS.contextMode)
    setContext(DEFAULT_OPTIONAL_PARAMS.context)
    setContextUrl(DEFAULT_OPTIONAL_PARAMS.contextUrl)
    toast.success("Дополнительные параметры сброшены")
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
      const contextValue = contextMode === "url" ? null : context.trim() || null
      const contextUrlValue = contextMode === "url" ? contextUrl.trim() : null
      const result = await generateNames({
        entity_type: entityType,
        description: trimmed,
        context: contextValue,
        context_url: contextUrlValue,
        style: namingStyle,
        count: suggestionCount,
        max_length: maxNameLength,
        prefer_short: preferShort,
        allow_digits: allowDigits,
        name_prefix: namePrefix.trim() || null,
        name_postfix: namePostfix.trim() || null,
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
                    <OptionalNamingParams
                      suggestionCount={suggestionCount}
                      onSuggestionCountChange={setSuggestionCount}
                      maxNameLength={maxNameLength}
                      onMaxNameLengthChange={setMaxNameLength}
                      preferShort={preferShort}
                      onPreferShortChange={setPreferShort}
                      allowDigits={allowDigits}
                      onAllowDigitsChange={setAllowDigits}
                      namePrefix={namePrefix}
                      onNamePrefixChange={setNamePrefix}
                      namePostfix={namePostfix}
                      onNamePostfixChange={setNamePostfix}
                      contextMode={contextMode}
                      onContextModeChange={setContextMode}
                      context={context}
                      onContextChange={setContext}
                      contextUrl={contextUrl}
                      onContextUrlChange={setContextUrl}
                      modified={optionalParamsModified}
                      onReset={handleResetOptionalParams}
                    />

                    <NamingPromptField
                      description={description}
                      onDescriptionChange={setDescription}
                      entityType={entityType}
                      onEntityTypeChange={handleEntityTypeChange}
                      entityTypes={entityTypes}
                      namingStyle={namingStyle}
                      onNamingStyleChange={setNamingStyle}
                      namingStyles={namingStyles}
                      loading={loading}
                    />
                  </FieldGroup>
                </form>
              ) : null}
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 border-t-0 bg-transparent">
              {llmConfig ? (
                <p className="text-xs text-muted-foreground">
                  Используются технологии{" "}
                  <span className="font-mono text-primary">
                    {llmConfig.base_url}
                  </span>{" "}
                  и модель{" "}
                  <span className="font-mono text-primary">
                    {llmConfig.model}
                  </span>
                </p>
              ) : null}
              <p className="text-xs text-muted-foreground">
                Используя сервис, вы обязуетесь соблюдать{" "}
                <Link
                  to="/terms"
                  className="underline underline-offset-4 hover:text-foreground"
                >
                  пользовательское соглашение.
                </Link>
              </p>
            </CardFooter>
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
                options={namingStyles}
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
            namingStyles={namingStyles}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
