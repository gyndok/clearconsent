"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, FileText, MessageSquare, Settings, User, HelpCircle, CheckCircle, Bell } from "lucide-react"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"

const items = [
  {
    title: "Dashboard",
    href: "/patient/dashboard",
    icon: LayoutDashboard,
    description: "Overview of your procedures",
  },
  {
    title: "My Procedures",
    href: "/patient/assignments",
    icon: FileText,
    description: "View assigned procedures",
    badge: "2",
  },
  {
    title: "Completed",
    href: "/patient/completed",
    icon: CheckCircle,
    description: "View completed procedures",
  },
  {
    title: "Messages",
    href: "/patient/messages",
    icon: MessageSquare,
    description: "Contact your doctor",
    badge: "3",
  },
  {
    title: "Notifications",
    href: "/patient/notifications",
    icon: Bell,
    description: "View your notifications",
  },
  {
    title: "Help",
    href: "/patient/help",
    icon: HelpCircle,
    description: "Get assistance",
  },
]

const accountItems = [
  {
    title: "Profile",
    href: "/patient/profile",
    icon: User,
    description: "Manage your profile",
  },
  {
    title: "Settings",
    href: "/patient/settings",
    icon: Settings,
    description: "Configure your account",
  },
]

export function PatientNav() {
  const pathname = usePathname()

  return (
    <>
      <SidebarGroup>
        <SidebarGroupLabel>Navigation</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.description}>
                  <Link href={item.href} className="flex w-full items-center justify-between">
                    <span className="flex items-center gap-3">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </span>
                    {item.badge && (
                      <Badge variant="secondary" className="ml-auto">
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <SidebarGroup>
        <SidebarGroupLabel>Account</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {accountItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.description}>
                  <Link href={item.href}>
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </>
  )
}
