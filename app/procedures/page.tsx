"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Button } from "@/components/ui/button"
import { ProceduresTable } from "@/components/procedures/procedures-table"
import { ProcedureFilters } from "@/components/procedures/procedure-filters"
import { Plus } from "lucide-react"
import { Breadcrumb } from "@/components/ui/breadcrumb"

export default function ProceduresPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null)
  const [mediaFilter, setMediaFilter] = useState<string | null>(null)
  const router = useRouter()

  return (
    <DashboardShell>
      <Breadcrumb items={[{ title: "Procedures", href: "/procedures" }]} className="mb-2" />
      <div className="flex items-center justify-between">
        <DashboardHeader heading="Procedures" text="Manage your procedure templates and materials." />
        <Button onClick={() => router.push("/procedures/add")}>
          <Plus className="mr-2 h-4 w-4" />
          Add Procedure
        </Button>
      </div>
      <div className="space-y-4">
        <ProcedureFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          categoryFilter={categoryFilter}
          onCategoryChange={setCategoryFilter}
          mediaFilter={mediaFilter}
          onMediaChange={setMediaFilter}
        />
        <ProceduresTable searchQuery={searchQuery} categoryFilter={categoryFilter} mediaFilter={mediaFilter} />
      </div>
    </DashboardShell>
  )
}
