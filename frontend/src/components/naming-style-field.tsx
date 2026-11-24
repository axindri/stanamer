import { Field, FieldLabel } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import {
  DEFAULT_NAMING_STYLE,
  NAMING_STYLE_OPTIONS,
  type NamingStyle,
  isNamingStyle,
} from "@/lib/style"

type NamingStyleFieldProps = {
  id: string
  value?: NamingStyle
  onValueChange: (value: NamingStyle) => void
  required?: boolean
  showLabel?: boolean
  className?: string
  triggerClassName?: string
}

export function NamingStyleField({
  id,
  value = DEFAULT_NAMING_STYLE,
  onValueChange,
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
          {NAMING_STYLE_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
              <span className="text-muted-foreground">
                {" "}
                — {option.example}
              </span>
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
