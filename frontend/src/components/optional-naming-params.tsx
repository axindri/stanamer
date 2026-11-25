import { useState } from "react"
import { ChevronDownIcon, RotateCcwIcon, SettingsIcon } from "lucide-react"

import { ContextField, type ContextMode } from "@/components/context-field"
import { NameLengthField } from "@/components/name-length-field"
import { SuggestionCountField } from "@/components/suggestion-count-field"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { MAX_NAME_AFFIX_LENGTH } from "@/lib/constants"

type OptionalNamingParamsProps = {
  suggestionCount: number
  onSuggestionCountChange: (value: number) => void
  maxNameLength: number
  onMaxNameLengthChange: (value: number) => void
  preferShort: boolean
  onPreferShortChange: (value: boolean) => void
  allowDigits: boolean
  onAllowDigitsChange: (value: boolean) => void
  namePrefix: string
  onNamePrefixChange: (value: string) => void
  namePostfix: string
  onNamePostfixChange: (value: string) => void
  contextMode: ContextMode
  onContextModeChange: (value: ContextMode) => void
  context: string
  onContextChange: (value: string) => void
  contextUrl: string
  onContextUrlChange: (value: string) => void
  modified: boolean
  onReset: () => void
}

export function OptionalNamingParams({
  suggestionCount,
  onSuggestionCountChange,
  maxNameLength,
  onMaxNameLengthChange,
  preferShort,
  onPreferShortChange,
  allowDigits,
  onAllowDigitsChange,
  namePrefix,
  onNamePrefixChange,
  namePostfix,
  onNamePostfixChange,
  contextMode,
  onContextModeChange,
  context,
  onContextChange,
  contextUrl,
  onContextUrlChange,
  modified,
  onReset,
}: OptionalNamingParamsProps) {
  const [open, setOpen] = useState(false)

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="rounded-md">
      <div className="flex items-center gap-1">
        <CollapsibleTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            className="group min-w-0 flex-1"
          >
            <SettingsIcon data-icon="inline-start" />
            <span className="truncate">Дополнительные параметры</span>
            {modified ? (
              <span className="shrink-0 text-muted-foreground">(изм.)</span>
            ) : null}
            <ChevronDownIcon className="ml-auto transition-transform group-data-[state=open]:rotate-180" />
          </Button>
        </CollapsibleTrigger>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={!modified}
          onClick={onReset}
          aria-label="Сбросить дополнительные параметры"
        >
          <RotateCcwIcon data-icon="inline-start" />
          Сбросить
        </Button>
      </div>
      <CollapsibleContent className="flex flex-col gap-4 px-2.5 pt-3 pb-2.5">
        <SuggestionCountField
          value={suggestionCount}
          onValueChange={onSuggestionCountChange}
        />
        <NameLengthField
          value={maxNameLength}
          onValueChange={onMaxNameLengthChange}
        />
        <Field>
          <FieldLabel htmlFor="prefer-short">Имена</FieldLabel>
          <ToggleGroup
            id="prefer-short"
            type="single"
            variant="outline"
            value={preferShort ? "yes" : "no"}
            onValueChange={(next) => {
              if (next === "yes" || next === "no") {
                onPreferShortChange(next === "yes")
              }
            }}
            className="w-full"
          >
            <ToggleGroupItem value="no" className="flex-1">
              Обычные
            </ToggleGroupItem>
            <ToggleGroupItem value="yes" className="flex-1">
              Короткие
            </ToggleGroupItem>
          </ToggleGroup>
        </Field>
        <Field>
          <FieldLabel htmlFor="allow-digits">Цифры в имени</FieldLabel>
          <ToggleGroup
            id="allow-digits"
            type="single"
            variant="outline"
            value={allowDigits ? "yes" : "no"}
            onValueChange={(next) => {
              if (next === "yes" || next === "no") {
                onAllowDigitsChange(next === "yes")
              }
            }}
            className="w-full"
          >
            <ToggleGroupItem value="yes" className="flex-1">
              Разрешить
            </ToggleGroupItem>
            <ToggleGroupItem value="no" className="flex-1">
              Запретить
            </ToggleGroupItem>
          </ToggleGroup>
        </Field>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="name-prefix">Префикс</FieldLabel>
            <Input
              id="name-prefix"
              value={namePrefix}
              maxLength={MAX_NAME_AFFIX_LENGTH}
              onChange={(event) =>
                onNamePrefixChange(
                  event.target.value.slice(0, MAX_NAME_AFFIX_LENGTH)
                )
              }
              placeholder="stg_"
            />
            <FieldDescription>
              До {MAX_NAME_AFFIX_LENGTH} символов.
            </FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="name-postfix">Постфикс</FieldLabel>
            <Input
              id="name-postfix"
              value={namePostfix}
              maxLength={MAX_NAME_AFFIX_LENGTH}
              onChange={(event) =>
                onNamePostfixChange(
                  event.target.value.slice(0, MAX_NAME_AFFIX_LENGTH)
                )
              }
              placeholder="_v1"
            />
            <FieldDescription>
              До {MAX_NAME_AFFIX_LENGTH} символов.
            </FieldDescription>
          </Field>
        </div>
        <Separator />
        <ContextField
          mode={contextMode}
          onModeChange={onContextModeChange}
          value={context}
          onValueChange={onContextChange}
          url={contextUrl}
          onUrlChange={onContextUrlChange}
        />
      </CollapsibleContent>
    </Collapsible>
  )
}
