import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react"

import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const THEME_OPTIONS = [
  { value: "system" as const, label: "Системная", icon: MonitorIcon },
  { value: "light" as const, label: "Светлая", icon: SunIcon },
  { value: "dark" as const, label: "Тёмная", icon: MoonIcon },
]

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const ActiveIcon =
    THEME_OPTIONS.find((option) => option.value === theme)?.icon ?? MonitorIcon

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label="Сменить тему"
        >
          <ActiveIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          {THEME_OPTIONS.map((option) => {
            const Icon = option.icon
            return (
              <DropdownMenuItem
                key={option.value}
                onClick={() => setTheme(option.value)}
                data-checked={theme === option.value || undefined}
              >
                <Icon data-icon="inline-start" />
                {option.label}
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
