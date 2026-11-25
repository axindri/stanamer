import { useRef, useState } from "react"
import {
  FileUpIcon,
  LinkIcon,
  PenLineIcon,
  RefreshCwIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

export type ContextMode = "manual" | "file" | "url"

type ContextFieldProps = {
  id?: string
  mode: ContextMode
  onModeChange: (mode: ContextMode) => void
  value: string
  onValueChange: (value: string) => void
  url: string
  onUrlChange: (url: string) => void
}

export function ContextField({
  id = "context",
  mode,
  onModeChange,
  value,
  onValueChange,
  url,
  onUrlChange,
}: ContextFieldProps) {
  const [fileName, setFileName] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleModeChange(next: string) {
    if (next !== "manual" && next !== "file" && next !== "url") {
      return
    }
    onModeChange(next)
    if (next === "manual") {
      setFileName(null)
    }
    if (next === "file") {
      onUrlChange("")
    }
    if (next === "url") {
      setFileName(null)
      onValueChange("")
    }
  }

  function clearFile() {
    setFileName(null)
    onValueChange("")
  }

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ""
    if (!file) {
      return
    }

    try {
      const text = await file.text()
      setFileName(file.name)
      onValueChange(text)
      toast.success("Контекст загружен", { description: file.name })
    } catch {
      toast.error("Не удалось прочитать файл")
    }
  }

  return (
    <Field>
      <FieldLabel htmlFor={`${id}-mode`}>Контекст</FieldLabel>
      <div className="flex items-center gap-2">
        <Select value={mode} onValueChange={handleModeChange}>
          <SelectTrigger id={`${id}-mode`} className="w-full min-w-0 flex-1">
            <SelectValue placeholder="Способ ввода" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="manual">
                <PenLineIcon />
                Вручную
                <span className="text-muted-foreground"> — ввести текст</span>
              </SelectItem>
              <SelectItem value="file">
                <FileUpIcon />
                Из файла
                <span className="text-muted-foreground"> — .raw / .txt</span>
              </SelectItem>
              <SelectItem value="url">
                <LinkIcon />
                По ссылке
                <span className="text-muted-foreground"> — git raw</span>
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        {mode === "manual" ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={!value}
            onClick={() => onValueChange("")}
          >
            <Trash2Icon data-icon="inline-start" />
            Очистить
          </Button>
        ) : null}
        {mode === "file" ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={!fileName}
            onClick={() => fileInputRef.current?.click()}
          >
            <RefreshCwIcon data-icon="inline-start" />
            Заменить
          </Button>
        ) : null}
        {mode === "url" ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={!url}
            onClick={() => onUrlChange("")}
          >
            <Trash2Icon data-icon="inline-start" />
            Очистить
          </Button>
        ) : null}
      </div>

      {mode === "manual" ? (
        <Textarea
          id={id}
          value={value}
          onChange={(event) => onValueChange(event.target.value)}
          placeholder="Слой stg/ods/dds, домен, система, договорённости по неймингу"
          rows={3}
          className="max-h-[48rem] overflow-y-auto"
        />
      ) : null}

      {mode === "file" ? (
        <>
          <input
            ref={fileInputRef}
            type="file"
            accept=".raw,.txt,text/plain"
            className="sr-only"
            onChange={(event) => void handleFileChange(event)}
          />
          {fileName ? (
            <div className="flex items-center gap-2 rounded-lg border border-border px-3 py-2">
              <span className="min-w-0 flex-1 truncate text-sm">
                {fileName}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label="Удалить файл"
                onClick={clearFile}
              >
                <XIcon />
              </Button>
            </div>
          ) : (
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => fileInputRef.current?.click()}
            >
              <FileUpIcon data-icon="inline-start" />
              Выбрать файл
            </Button>
          )}
        </>
      ) : null}

      {mode === "url" ? (
        <>
          <Input
            id={`${id}-url`}
            type="url"
            value={url}
            onChange={(event) => onUrlChange(event.target.value)}
            placeholder="https://raw.githubusercontent.com/.../naming-context.raw"
          />
        </>
      ) : null}
    </Field>
  )
}
