"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
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
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar"

const mainNavItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    description: "Overview of your practice",
  },
  {
    title: "Patients",
    href: "/patients",
    icon: Users,
    description: "Manage your patients",
  },
  {
    title: "Procedures",
    href: "/procedures",
    icon: FileText,
    description: "Manage your procedures",
  },
  {
    title: "Messages",
    href: "/messages",
    icon: MessageSquare,
    description: "Patient communications",
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: BarChart,
    description: "View insights and reports",
  },
]

const accountNavItems = [
  {
    title: "Profile",
    href: "/profile",
    icon: User,
    description: "Your personal information",
  },
  {
    title: "Notifications",
    href: "/notifications",
    icon: Bell,
    description: "Manage your notifications",
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
    description: "Account settings",
  },
  {
    title: "Help",
    href: "/help",
    icon: HelpCircle,
    description: "Get help and support",
  },
]

export function DoctorSidebar() {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === "/dashboard" && pathname === "/dashboard") {
      return true
    }
    return pathname.startsWith(href) && href !== "/dashboard"
  }

  return (
    <Sidebar>
      <SidebarHeader className="flex h-16 items-center border-b px-6">
        <div className="flex items-center gap-2 font-semibold">
          <span className="text-xl">ClearConsent</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={isActive(item.href)} tooltip={item.description}>
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {accountNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={isActive(item.href)} tooltip={item.description}>
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Sign out">
              <Link href="/logout">
                <LogOut />
                <span>Sign out</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
