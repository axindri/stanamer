import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"

export const DEFAULT_SUGGESTION_COUNT = 5
export const MIN_SUGGESTION_COUNT = 3
export const MAX_SUGGESTION_COUNT = 7

const COUNT_OPTIONS = [3, 4, 5, 6, 7] as const

type SuggestionCountFieldProps = {
  id?: string
  value: number
  onValueChange: (value: number) => void
}

export function SuggestionCountField({
  id = "suggestion-count",
  value,
  onValueChange,
}: SuggestionCountFieldProps) {
  return (
    <Field>
      <FieldLabel htmlFor={id}>Количество вариантов</FieldLabel>
      <Select
        value={String(value)}
        onValueChange={(next) => onValueChange(Number(next))}
      >
        <SelectTrigger id={id} className="w-full">
          <SelectValue placeholder="Количество" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {COUNT_OPTIONS.map((count) => (
              <SelectItem key={count} value={String(count)}>
                {count}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Slider
        min={MIN_SUGGESTION_COUNT}
        max={MAX_SUGGESTION_COUNT}
        step={1}
        value={[value]}
        onValueChange={(next) => {
          const selected = next[0]
          if (typeof selected === "number") {
            onValueChange(selected)
          }
        }}
        aria-label="Количество вариантов"
      />
      <FieldDescription>
        От {MIN_SUGGESTION_COUNT} до {MAX_SUGGESTION_COUNT}, по умолчанию{" "}
        {DEFAULT_SUGGESTION_COUNT}.
      </FieldDescription>
    </Field>
  )
}
