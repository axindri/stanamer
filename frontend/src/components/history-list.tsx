import { useState } from "react"
import { ChevronDownIcon, HistoryIcon, Trash2Icon } from "lucide-react"

import { NamingStyleField } from "@/components/naming-style-field"
import { SuggestionList } from "@/components/suggestion-list"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { EntityTypeIcon } from "@/lib/entity-meta"
import type { NamingHistoryEntry } from "@/lib/history"
import type { NamingStyle } from "@/lib/style"

type HistoryListProps = {
  entries: NamingHistoryEntry[]
  onClear: () => void
  onStyleChange: (entryId: string, style: NamingStyle) => void
  entityLabels: Record<string, string>
}

function formatTime(iso: string): string {
  try {
    return new Intl.DateTimeFormat("ru-RU", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso))
  } catch {
    return ""
  }
}

function HistoryEntryCard({
  entry,
  entityLabels,
  onStyleChange,
  defaultOpen,
}: {
  entry: NamingHistoryEntry
  entityLabels: Record<string, string>
  onStyleChange: (entryId: string, style: NamingStyle) => void
  defaultOpen: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <Card
        className={cn(
          "overflow-hidden py-0 transition-colors",
          open && "border-ring"
        )}
      >
        <CollapsibleTrigger asChild>
          <button
            type="button"
            className="w-full cursor-pointer px-(--card-spacing) py-(--card-spacing) text-left transition-colors outline-none hover:bg-muted/40 focus-visible:bg-muted/40"
          >
            <CardHeader className="gap-3 p-0">
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 flex-col gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className="gap-1.5">
                      <EntityTypeIcon type={entry.entityType} />
                      {entityLabels[entry.entityType] ?? entry.entityType}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatTime(entry.createdAt)}
                    </span>
                  </div>
                  <CardTitle className="text-base leading-snug">
                    {entry.description}
                  </CardTitle>
                </div>
                <ChevronDownIcon
                  className={cn(
                    "mt-1 shrink-0 text-muted-foreground transition-transform",
                    open && "rotate-180"
                  )}
                />
              </div>
            </CardHeader>
          </button>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="flex flex-col gap-4 border-t px-(--card-spacing) pt-4 pb-(--card-spacing)">
            <NamingStyleField
              id={`history-style-${entry.id}`}
              value={entry.style}
              onValueChange={(style) => onStyleChange(entry.id, style)}
            />
            <SuggestionList
              suggestions={entry.suggestions}
              itemKeyPrefix={`${entry.id}-`}
            />
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  )
}

export function HistoryList({
  entries,
  onClear,
  onStyleChange,
  entityLabels,
}: HistoryListProps) {
  if (entries.length === 0) {
    return (
      <Empty className="border border-dashed">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <HistoryIcon />
          </EmptyMedia>
          <EmptyTitle>История пуста</EmptyTitle>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-medium">История нейминга</h2>
          <Badge variant="secondary">{entries.length}</Badge>
        </div>
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          aria-label="Очистить историю"
          onClick={onClear}
        >
          <Trash2Icon />
        </Button>
      </div>
      <Separator />
      <ul className="flex flex-col gap-4">
        {entries.map((entry, index) => (
          <li key={entry.id}>
            <HistoryEntryCard
              entry={entry}
              entityLabels={entityLabels}
              onStyleChange={onStyleChange}
              defaultOpen={index === 0}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}
