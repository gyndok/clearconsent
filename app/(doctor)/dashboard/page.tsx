import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { PatientsTable } from "@/components/dashboard/patients-table"
import { ProceduresTable } from "@/components/dashboard/procedures-table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function DashboardPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Dashboard" text="Manage your patients and procedures." />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCards />
      </div>
      <Tabs defaultValue="patients" className="mt-6">
        <TabsList>
          <TabsTrigger value="patients">Patients</TabsTrigger>
          <TabsTrigger value="procedures">Procedures</TabsTrigger>
        </TabsList>
        <TabsContent value="patients" className="space-y-4">
          <PatientsTable />
        </TabsContent>
        <TabsContent value="procedures" className="space-y-4">
          <ProceduresTable />
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}
