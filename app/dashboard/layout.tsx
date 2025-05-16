import type React from "react"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { UserNav } from "@/components/dashboard/user-nav"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarProvider } from "@/components/ui/sidebar"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-40 border-b bg-background">
          <div className="flex h-16 items-center px-4">
            <div className="ml-auto flex items-center space-x-4">
              <UserNav />
            </div>
          </div>
        </header>
        <div className="flex flex-1">
          <Sidebar>
            <SidebarHeader className="flex h-16 items-center border-b px-6">
              <div className="flex items-center gap-2 font-semibold">
                <span className="text-xl">ClearConsent</span>
              </div>
            </SidebarHeader>
            <SidebarContent>
              <DashboardNav />
            </SidebarContent>
            <SidebarFooter className="p-6 text-xs text-muted-foreground">
              <p>© 2025 ClearConsent. All rights reserved.</p>
            </SidebarFooter>
          </Sidebar>
          <main className="flex-1 p-8">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}
