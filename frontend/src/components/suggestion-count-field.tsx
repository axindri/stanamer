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
import {
  DEFAULT_SUGGESTION_COUNT,
  MAX_SUGGESTION_COUNT,
  MIN_SUGGESTION_COUNT,
  SUGGESTION_COUNT_OPTIONS,
} from "@/lib/constants"

export {
  DEFAULT_SUGGESTION_COUNT,
  MAX_SUGGESTION_COUNT,
  MIN_SUGGESTION_COUNT,
} from "@/lib/constants"

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
            {SUGGESTION_COUNT_OPTIONS.map((count) => (
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
