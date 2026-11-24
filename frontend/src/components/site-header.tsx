import { NavLink } from "react-router-dom"

import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"

const NAV_LINK_CLASS =
  "text-sm text-muted-foreground transition-colors hover:text-foreground"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-sm">
      <div className="mx-auto flex h-14 w-full max-w-2xl items-center justify-between gap-4 px-6">
        <NavLink
          to="/"
          className="flex items-center gap-2 text-sm font-medium tracking-tight"
          end
        >
          <img
            src="/icon.jpg"
            alt=""
            className="size-6 rounded-md object-cover"
          />
          STANAMER
        </NavLink>
        <div className="ml-auto flex items-center gap-4">
          <nav className="flex items-center">
            <NavLink
              to="/naming"
              className={({ isActive }) =>
                cn(NAV_LINK_CLASS, isActive && "text-foreground")
              }
            >
              Нейминг
            </NavLink>
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
