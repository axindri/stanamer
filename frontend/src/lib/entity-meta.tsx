import type { LucideIcon } from "lucide-react"
import {
  Columns3Icon,
  DatabaseIcon,
  FolderTreeIcon,
  FunctionSquareIcon,
  GaugeIcon,
  RadioIcon,
  WorkflowIcon,
} from "lucide-react"

export const ENTITY_ICONS: Record<string, LucideIcon> = {
  table: DatabaseIcon,
  column: Columns3Icon,
  dag: WorkflowIcon,
  topic: RadioIcon,
  metric: GaugeIcon,
  schema: FolderTreeIcon,
  function: FunctionSquareIcon,
}

export function EntityTypeIcon({
  type,
  className,
}: {
  type: string
  className?: string
}) {
  const Icon = ENTITY_ICONS[type] ?? DatabaseIcon
  return <Icon className={className} />
}
