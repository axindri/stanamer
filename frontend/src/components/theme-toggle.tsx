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
import { THEME_OPTIONS } from "@/lib/constants"

const THEME_ICONS = {
  system: MonitorIcon,
  light: SunIcon,
  dark: MoonIcon,
} as const

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const ActiveIcon = THEME_ICONS[theme] ?? MonitorIcon

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Сменить тему"
        >
          <ActiveIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          {THEME_OPTIONS.map((option) => {
            const Icon = THEME_ICONS[option.value]
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
