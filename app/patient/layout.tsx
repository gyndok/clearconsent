import type React from "react"
import { PatientNav } from "@/components/patient/patient-nav"
import { PatientUserNav } from "@/components/patient/patient-user-nav"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar"
import { MobileNav } from "@/components/patient/patient-mobile-nav"

interface PatientLayoutProps {
  children: React.ReactNode
}

export default function PatientLayout({ children }: PatientLayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-40 border-b bg-background">
          <div className="flex h-16 items-center px-4 md:px-6">
            <SidebarTrigger className="mr-2 md:hidden" />
            <div className="flex items-center gap-2 font-semibold md:hidden">
              <span className="text-xl">ClearConsent</span>
            </div>
            <div className="ml-auto flex items-center space-x-4">
              <MobileNav />
              <PatientUserNav />
            </div>
          </div>
        </header>
        <div className="flex flex-1">
          <Sidebar className="border-r">
            <SidebarHeader className="flex h-16 items-center border-b px-6">
              <div className="flex items-center gap-2 font-semibold">
                <span className="text-xl">ClearConsent</span>
                <span className="rounded-md bg-primary px-1.5 py-0.5 text-xs text-primary-foreground">Patient</span>
              </div>
            </SidebarHeader>
            <SidebarContent>
              <PatientNav />
            </SidebarContent>
            <SidebarFooter className="p-6 text-xs text-muted-foreground">
              <p>© 2025 ClearConsent. All rights reserved.</p>
              <p className="mt-2">Need help? Contact your healthcare provider.</p>
            </SidebarFooter>
          </Sidebar>
          <SidebarInset className="flex flex-col">
            <main className="flex-1 overflow-auto p-4 md:p-8">{children}</main>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  )
}
