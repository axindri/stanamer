import { Field, FieldLabel } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { MetaItem } from "@/lib/api"
import { EntityTypeIcon } from "@/lib/entity-meta"

type EntityTypeFieldProps = {
  id?: string
  value: string
  onValueChange: (value: string) => void
  options: MetaItem[]
  required?: boolean
}

export function EntityTypeField({
  id = "entity-type",
  value,
  onValueChange,
  options,
  required = false,
}: EntityTypeFieldProps) {
  return (
    <Field>
      <FieldLabel htmlFor={id}>
        {required ? (
          <span>
            Тип сущности
            <span className="text-destructive">*</span>
          </span>
        ) : (
          "Тип сущности"
        )}
      </FieldLabel>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger id={id} className="w-full">
          <SelectValue placeholder="Выберите тип" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {options.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                <EntityTypeIcon type={item.value} />
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  )
}
