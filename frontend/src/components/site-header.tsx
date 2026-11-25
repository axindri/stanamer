import { NavLink } from "react-router-dom"

import { ThemeToggle } from "@/components/theme-toggle"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"

const NAV_ITEMS = [
  { to: "/naming", label: "Нейминг" },
  { to: "/dev", label: "Development" },
] as const

function blurNavTarget(event: React.MouseEvent<HTMLAnchorElement>) {
  event.currentTarget.blur()
}

function navLinkClassName(isActive: boolean) {
  return cn(
    navigationMenuTriggerStyle(),
    "text-muted-foreground hover:text-foreground",
    isActive && "bg-muted text-foreground"
  )
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="mx-auto flex h-14 w-full max-w-screen-2xl items-center gap-2 px-4 sm:px-6">
        <NavLink
          to="/"
          className="mr-2 flex items-center gap-2 text-sm font-medium tracking-tight sm:mr-4"
          end
          onClick={blurNavTarget}
        >
          <img
            src="/icon.jpg"
            alt=""
            className="size-6 rounded-md object-cover"
          />
          STANAMER
        </NavLink>

        <NavigationMenu viewport={false} className="hidden sm:flex">
          <NavigationMenuList>
            {NAV_ITEMS.map((item) => (
              <NavigationMenuItem key={item.to}>
                <NavigationMenuLink asChild>
                  <NavLink
                    to={item.to}
                    onClick={blurNavTarget}
                    className={({ isActive }) => navLinkClassName(isActive)}
                  >
                    {item.label}
                  </NavLink>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="ml-auto flex items-center gap-2">
          <nav className="flex items-center gap-1 sm:hidden">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={blurNavTarget}
                className={({ isActive }) => navLinkClassName(isActive)}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
