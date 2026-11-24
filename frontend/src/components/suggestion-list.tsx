import { CopyIcon } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { NameSuggestion } from "@/lib/api"

type SuggestionListProps = {
  suggestions: NameSuggestion[]
  itemKeyPrefix?: string
}

async function handleCopy(name: string) {
  try {
    await navigator.clipboard.writeText(name)
    toast.success("Скопировано", { description: name })
  } catch {
    toast.error("Не удалось скопировать")
  }
}

export function SuggestionList({
  suggestions,
  itemKeyPrefix = "",
}: SuggestionListProps) {
  return (
    <ul className="flex flex-col gap-3">
      {suggestions.map((item) => (
        <li key={`${itemKeyPrefix}${item.name}`}>
          <Card
            size="sm"
            role="button"
            tabIndex={0}
            onClick={() => void handleCopy(item.name)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault()
                void handleCopy(item.name)
              }
            }}
            className="cursor-pointer transition-colors hover:bg-muted/40 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            <CardHeader>
              <CardTitle className="font-mono text-sm break-all">
                {item.name}
              </CardTitle>
              <CardDescription>{item.rationale}</CardDescription>
              <CardAction>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Скопировать"
                  onClick={(event) => {
                    event.stopPropagation()
                    void handleCopy(item.name)
                  }}
                >
                  <CopyIcon />
                </Button>
              </CardAction>
            </CardHeader>
          </Card>
        </li>
      ))}
    </ul>
  )
}
