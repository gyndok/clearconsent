"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import {
  LayoutDashboard,
  Users,
  FileText,
  MessageSquare,
  Settings,
  User,
  Bell,
  HelpCircle,
  BarChart,
  LogOut,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

interface MobileNavProps {
  isOpen: boolean
  onClose: () => void
}

const mainNavItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Patients",
    href: "/patients",
    icon: Users,
  },
  {
    title: "Procedures",
    href: "/procedures",
    icon: FileText,
  },
  {
    title: "Messages",
    href: "/messages",
    icon: MessageSquare,
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: BarChart,
  },
]

const accountNavItems = [
  {
    title: "Profile",
    href: "/profile",
    icon: User,
  },
  {
    title: "Notifications",
    href: "/notifications",
    icon: Bell,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
  {
    title: "Help",
    href: "/help",
    icon: HelpCircle,
  },
]

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === "/dashboard" && pathname === "/dashboard") {
      return true
    }
    return pathname.startsWith(href) && href !== "/dashboard"
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="w-[300px] sm:w-[350px] p-0">
        <SheetHeader className="border-b p-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-xl">ClearConsent</SheetTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-4rem)]">
          <div className="p-4 space-y-6">
            <div className="space-y-1">
              <h3 className="text-xs font-medium text-muted-foreground px-2">Main</h3>
              <nav className="space-y-1">
                {mainNavItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${
                      isActive(item.href)
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.title}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="space-y-1">
              <h3 className="text-xs font-medium text-muted-foreground px-2">Account</h3>
              <nav className="space-y-1">
                {accountNavItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${
                      isActive(item.href)
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.title}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="pt-4 border-t">
              <Link
                href="/logout"
                onClick={onClose}
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted hover:text-foreground"
              >
                <LogOut className="h-5 w-5" />
                Sign out
              </Link>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
