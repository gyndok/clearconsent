"use client"

import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { ProcedureForm } from "@/components/procedures/procedure-form"
import { Breadcrumb } from "@/components/ui/breadcrumb"

export default function AddProcedurePage() {
  const router = useRouter()

  return (
    <DashboardShell>
      <Breadcrumb
        items={[
          { title: "Procedures", href: "/procedures" },
          { title: "Add Procedure", href: "/procedures/add" },
        ]}
        className="mb-2"
      />
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" onClick={() => router.back()} className="mr-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <DashboardHeader
          heading="Add New Procedure"
          text="Create a new procedure template with information and materials."
        />
      </div>

      <ProcedureForm />
    </DashboardShell>
  )
}
