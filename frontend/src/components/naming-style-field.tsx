import { Field, FieldLabel } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { NamingStyleMetaItem } from "@/lib/api"
import { cn } from "@/lib/utils"
import {
  DEFAULT_NAMING_STYLE,
  type NamingStyle,
  isNamingStyle,
} from "@/lib/style"

type NamingStyleFieldProps = {
  id: string
  value?: NamingStyle
  onValueChange: (value: NamingStyle) => void
  options: NamingStyleMetaItem[]
  required?: boolean
  showLabel?: boolean
  className?: string
  triggerClassName?: string
}

export function NamingStyleField({
  id,
  value = DEFAULT_NAMING_STYLE,
  onValueChange,
  options,
  required = false,
  showLabel = true,
  className,
  triggerClassName,
}: NamingStyleFieldProps) {
  const select = (
    <Select
      value={value}
      onValueChange={(next) => {
        if (isNamingStyle(next)) {
          onValueChange(next)
        }
      }}
    >
      <SelectTrigger id={id} className={cn("w-full", triggerClassName)}>
        <SelectValue placeholder="Стиль имени" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )

  if (!showLabel) {
    return <div className={className}>{select}</div>
  }

  return (
    <Field className={className}>
      <FieldLabel htmlFor={id}>
        {required ? (
          <span>
            Стиль имени
            <span className="text-destructive">*</span>
          </span>
        ) : (
          "Стиль имени"
        )}
      </FieldLabel>
      {select}
    </Field>
  )
}
