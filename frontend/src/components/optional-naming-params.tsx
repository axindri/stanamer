import { useState } from "react"
import { ChevronDownIcon, SettingsIcon } from "lucide-react"

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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

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
  contextMode: ContextMode
  onContextModeChange: (value: ContextMode) => void
  context: string
  onContextChange: (value: string) => void
  contextUrl: string
  onContextUrlChange: (value: string) => void
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
  contextMode,
  onContextModeChange,
  context,
  onContextChange,
  contextUrl,
  onContextUrlChange,
}: OptionalNamingParamsProps) {
  const [open, setOpen] = useState(false)

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className="rounded-md"
    >
      <CollapsibleTrigger asChild>
        <Button type="button" variant="ghost" className="group w-full">
          <SettingsIcon data-icon="inline-start" />
          Дополнительные параметры
          <ChevronDownIcon className="ml-auto transition-transform group-data-[state=open]:rotate-180" />
        </Button>
      </CollapsibleTrigger>
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
          <FieldLabel htmlFor="prefer-short">Короткие имена</FieldLabel>
          <Select
            value={preferShort ? "yes" : "no"}
            onValueChange={(next) => onPreferShortChange(next === "yes")}
          >
            <SelectTrigger id="prefer-short" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="no">Обычные</SelectItem>
                <SelectItem value="yes">Предпочитать короткие</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <FieldDescription>
            Сильнее укорачивать идентификаторы в пределах лимита длины.
          </FieldDescription>
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
        <Field>
          <FieldLabel htmlFor="name-prefix">Префикс имени</FieldLabel>
          <Input
            id="name-prefix"
            value={namePrefix}
            onChange={(event) => onNamePrefixChange(event.target.value)}
            placeholder="Например: stg_ или ods_"
          />
          <FieldDescription>
            Если задан — все варианты должны начинаться с этого префикса.
          </FieldDescription>
        </Field>
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
