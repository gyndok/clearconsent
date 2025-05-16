import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { PatientsTable } from "@/components/patients/patients-table"
import { PatientFilters } from "@/components/patients/patient-filters"
import { Breadcrumb } from "@/components/ui/breadcrumb"

export default function PatientsPage() {
  return (
    <DashboardShell>
      <Breadcrumb items={[{ title: "Patients", href: "/patients" }]} className="mb-2" />
      <DashboardHeader heading="Patients" text="Manage your patients and their assigned procedures." />
      <div className="space-y-4">
        <PatientFilters />
        <PatientsTable />
      </div>
    </DashboardShell>
  )
}
