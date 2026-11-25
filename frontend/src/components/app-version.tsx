import { APP_VERSION } from "@/lib/constants"

export function AppVersion() {
  return (
    <p className="pointer-events-none fixed right-3 bottom-3 z-40 text-xs text-muted-foreground">
      v{APP_VERSION}
    </p>
  )
}
