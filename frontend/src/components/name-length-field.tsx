import { useEffect, useState } from "react"

import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  DEFAULT_MAX_NAME_LENGTH,
  MAX_MAX_NAME_LENGTH,
  MIN_MAX_NAME_LENGTH,
  clampMaxNameLength,
} from "@/lib/name-length"

type NameLengthFieldProps = {
  id?: string
  value: number
  onValueChange: (value: number) => void
  required?: boolean
}

export function NameLengthField({
  id = "max-name-length",
  value,
  onValueChange,
  required = false,
}: NameLengthFieldProps) {
  const [draft, setDraft] = useState(String(value))

  useEffect(() => {
    setDraft(String(value))
  }, [value])

  function commit() {
    const parsed = Number(draft)
    const next = clampMaxNameLength(
      draft.trim() === "" || Number.isNaN(parsed)
        ? DEFAULT_MAX_NAME_LENGTH
        : parsed
    )
    setDraft(String(next))
    onValueChange(next)
  }

  return (
    <Field>
      <FieldLabel htmlFor={id}>
        {required ? (
          <span>
            Макс. длина имени
            <span className="text-destructive">*</span>
          </span>
        ) : (
          "Максимальная длина имени"
        )}
      </FieldLabel>
      <Input
        id={id}
        type="number"
        min={MIN_MAX_NAME_LENGTH}
        max={MAX_MAX_NAME_LENGTH}
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onBlur={commit}
      />
      <FieldDescription>
        По умолчанию {DEFAULT_MAX_NAME_LENGTH} символов (от{" "}
        {MIN_MAX_NAME_LENGTH} до {MAX_MAX_NAME_LENGTH}).
      </FieldDescription>
    </Field>
  )
}
