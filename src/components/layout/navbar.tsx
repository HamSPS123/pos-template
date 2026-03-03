"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { ChevronDown, Menu, Search, Sun, Moon, Settings as SettingsIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useState } from "react"
import { images, metaData, type MenuSection, type MenuItem } from "@/constants"
import { useFilteredMenu } from "@/hooks/use-filtered-menu"
import { useTheme } from "next-themes"
import { UserButton } from "./user-button"
import Notification from "./notification"

function NavSectionMenu({ section }: { section: MenuSection }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const isSectionActive = section.items.some(
    (item) => pathname === item.href || pathname.startsWith((item.href ?? "") + "/")
  )

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "flex items-center gap-1.5 rounded-sm px-3 py-1.5 text-sm font-medium transition-colors outline-none",
            isSectionActive
              ? "bg-primary/10 text-primary dark:bg-primary dark:text-primary-foreground"
              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          )}
        >
          <section.icon className="h-4 w-4 shrink-0" />
          <span>{section.section}</span>
          <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-[180px]">
        {section.items.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith((item.href ?? "") + "/")
          return (
            <DropdownMenuItem key={item.href} asChild>
              <Link
                href={item.href || "#"}
                className={cn(
                  "flex items-center gap-2 cursor-pointer",
                  isActive && "bg-primary/10 text-primary font-medium"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{item.title}</span>
                {item.badge && (
                  <Badge variant="secondary" className="ml-auto h-5 px-1.5">
                    {item.badge}
                  </Badge>
                )}
              </Link>
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function MobileNavMenuItem({ item, onClose }: { item: MenuItem; onClose: () => void }) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const Icon = item.icon
  const isActive = pathname === item.href || pathname.startsWith((item.href ?? "") + "/")
  const hasSubmenu = item.submenu && item.submenu.length > 0

  if (hasSubmenu) {
    return (
      <div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "flex w-full items-center gap-3 rounded-sm px-3 py-2 text-sm font-medium transition-colors",
            isActive
              ? "bg-primary/10 dark:bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          )}
        >
          <Icon className="h-4 w-4 shrink-0" />
          <span className="flex-1 text-left">{item.title}</span>
          <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
        </button>
        {isOpen && (
          <div className="ml-6 mt-1 space-y-1 border-l pl-3">
            {item.submenu?.map((subItem) => {
              const SubIcon = subItem.icon
              const isSubActive = pathname === subItem.href
              return (
                <Link
                  key={subItem.href}
                  href={subItem.href || "#"}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 rounded-sm px-3 py-2 text-sm transition-colors",
                    isSubActive
                      ? "bg-primary/10 dark:bg-primary  text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <SubIcon className="h-4 w-4 shrink-0" />
                  <span>{subItem.title}</span>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  return (
    <Link
      href={item.href || "#"}
      onClick={onClose}
      className={cn(
        "flex items-center gap-3 rounded-sm px-3 py-2 text-sm font-medium transition-colors",
        isActive
          ? "bg-primary/10 dark:bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span className="flex-1">{item.title}</span>
      {item.badge && (
        <Badge variant="secondary" className="h-5 px-1.5">
          {item.badge}
        </Badge>
      )}
    </Link>
  )
}

export function Navbar() {
  const menuSections = useFilteredMenu()
  const { theme, setTheme } = useTheme()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <TooltipProvider delayDuration={0}>
      <header className="sticky top-0 z-50 w-full border-b bg-background">
        {/* Row 1: Logo + Search + Actions */}
        <div className="flex h-14 items-center gap-4 border-b px-4 lg:px-6">
          {/* Mobile menu trigger */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden shrink-0">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <div className="flex h-14 items-center border-b px-4">
                <Link href="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
                  <div className="flex h-8 w-8 items-center justify-center rounded-sm">
                    <Image src={images.logo} alt="Logo" width={32} height={32} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold">{metaData.shortTitle}</span>
                    <span className="text-xs text-muted-foreground">{metaData.title}</span>
                  </div>
                </Link>
              </div>
              <nav className="flex-1 space-y-4 overflow-y-auto p-4">
                {menuSections.map((section) => (
                  <div key={section.section}>
                    <h4 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {section.section}
                    </h4>
                    <div className="space-y-1">
                      {section.items.map((item) => (
                        <MobileNavMenuItem
                          key={item.title}
                          item={item}
                          onClose={() => setMobileOpen(false)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </nav>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="flex h-full w-full items-center justify-center rounded-sm">
              <img src={images.logo.src} alt="Logo" className="w-40 h-16 object-cover"/>
            </div>
            {/* <div className="hidden sm:flex flex-col">
              <span className="text-sm font-semibold leading-none">{metaData.shortTitle}</span>
              <span className="text-xs text-muted-foreground">{metaData.title}</span>
            </div> */}
          </Link>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Search */}
          <div className="hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="pl-10 w-48 lg:w-64"
              />
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1 shrink-0">
            {/* Theme Toggle */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                >
                  <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Toggle theme</TooltipContent>
            </Tooltip>

            {/* Settings */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="hidden md:flex">
                  <SettingsIcon className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Settings</TooltipContent>
            </Tooltip>

            {/* Notifications */}
            <Notification />

            <Separator orientation="vertical" className="h-6 mx-1" />

            {/* User Menu */}
            <UserButton />
          </div>
        </div>

        {/* Row 2: Sections as dropdown menus (desktop only) */}
        <div className="hidden lg:flex h-10 items-center gap-1 px-4 lg:px-6 overflow-x-auto">
          {menuSections.map((section) => (
            <NavSectionMenu key={section.section} section={section} />
          ))}
        </div>
      </header>
    </TooltipProvider>
  )
}
