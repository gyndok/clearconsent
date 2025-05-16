"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { DoctorSidebar } from "@/components/layout/doctor-sidebar"
import { UserNav } from "@/components/layout/user-nav"
import { MobileNav } from "@/components/layout/mobile-nav"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"

interface DoctorLayoutProps {
  children: React.ReactNode
}

export default function DoctorLayout({ children }: DoctorLayoutProps) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)
  const pathname = usePathname()

  // Close mobile nav when route changes
  useEffect(() => {
    setIsMobileNavOpen(false)
  }, [pathname])

  return (
    <SidebarProvider>
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-40 border-b bg-background">
          <div className="flex h-16 items-center px-4">
            <div className="md:hidden">
              <Button variant="ghost" size="icon" onClick={() => setIsMobileNavOpen(true)}>
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
              <MobileNav isOpen={isMobileNavOpen} onClose={() => setIsMobileNavOpen(false)} />
            </div>
            <div className="hidden md:flex md:items-center md:gap-2 md:font-semibold">
              <span className="text-xl">ClearConsent</span>
            </div>
            <div className="ml-auto flex items-center gap-4">
              <UserNav />
            </div>
          </div>
        </header>
        <div className="flex flex-1">
          <DoctorSidebar />
          <main className="flex-1 p-8">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}
