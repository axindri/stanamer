import { ArrowUpIcon, ChevronDownIcon, Loader2Icon } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Field, FieldLabel } from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import type { EntityTypeMetaItem, NamingStyleMetaItem } from "@/lib/api"
import { MIN_DESCRIPTION_LENGTH } from "@/lib/constants"
import { EntityTypeIcon } from "@/lib/entity-meta"
import {
  DEFAULT_NAMING_STYLE,
  type NamingStyle,
  isNamingStyle,
} from "@/lib/style"

export { MIN_DESCRIPTION_LENGTH }

type NamingPromptFieldProps = {
  description: string
  onDescriptionChange: (value: string) => void
  entityType: string
  onEntityTypeChange: (value: string) => void
  entityTypes: EntityTypeMetaItem[]
  namingStyle: NamingStyle
  onNamingStyleChange: (value: NamingStyle) => void
  namingStyles: NamingStyleMetaItem[]
  loading?: boolean
}

export function NamingPromptField({
  description,
  onDescriptionChange,
  entityType,
  onEntityTypeChange,
  entityTypes,
  namingStyle,
  onNamingStyleChange,
  namingStyles,
  loading = false,
}: NamingPromptFieldProps) {
  const currentEntity =
    entityTypes.find((item) => item.value === entityType) ?? entityTypes[0]
  const currentStyle =
    namingStyles.find((item) => item.value === namingStyle) ??
    namingStyles.find((item) => item.value === DEFAULT_NAMING_STYLE) ??
    namingStyles[0]

  return (
    <Field>
      <FieldLabel htmlFor="description" className="sr-only">
        Описание
      </FieldLabel>
      <InputGroup>
        <InputGroupTextarea
          id="description"
          value={description}
          onChange={(event) => onDescriptionChange(event.target.value)}
          placeholder="Например: справочник клиентов из CRM с историей изменений"
          rows={4}
          required
          minLength={MIN_DESCRIPTION_LENGTH}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault()
              if (!loading) {
                event.currentTarget.form?.requestSubmit()
              }
            }
          }}
          className="p-3"
        />
        <InputGroupAddon align="block-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <InputGroupButton
                size="sm"
                variant="outline"
                aria-label={`Тип сущности: ${currentEntity?.label ?? "Тип"}`}
                className="ml-auto rounded-full"
              >
                {currentEntity ? (
                  <EntityTypeIcon type={currentEntity.value} />
                ) : null}
                {currentEntity?.label ?? "Тип"}
                <ChevronDownIcon />
              </InputGroupButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuRadioGroup
                value={entityType}
                onValueChange={onEntityTypeChange}
              >
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Тип сущности</DropdownMenuLabel>
                  {entityTypes.map((item) => (
                    <DropdownMenuRadioItem key={item.value} value={item.value}>
                      <EntityTypeIcon type={item.value} />
                      {item.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <InputGroupButton
                size="sm"
                variant="outline"
                aria-label={`Стиль имени: ${currentStyle?.label ?? "Стиль"}`}
                className="rounded-full"
              >
                <span className="text-muted-foreground">Стиль</span>
                {currentStyle?.label ?? "—"}
                <ChevronDownIcon />
              </InputGroupButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-36">
              <DropdownMenuGroup>
                <DropdownMenuLabel>Стиль имени</DropdownMenuLabel>
                <DropdownMenuRadioGroup
                  value={namingStyle}
                  onValueChange={(next) => {
                    if (isNamingStyle(next)) {
                      onNamingStyleChange(next)
                    }
                  }}
                >
                  {namingStyles.map((item) => (
                    <DropdownMenuRadioItem key={item.value} value={item.value}>
                      {item.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <InputGroupButton
            type="submit"
            size="icon-sm"
            variant="default"
            className="rounded-full"
            aria-label="Сгенерировать"
          >
            {loading ? (
              <Loader2Icon className="animate-spin" />
            ) : (
              <ArrowUpIcon />
            )}
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  )
}
