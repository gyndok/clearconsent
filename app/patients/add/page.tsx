"use client"
import { useRouter } from "next/navigation"
import { AddPatientWizard } from "@/components/patients/add-patient-wizard"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { Breadcrumb } from "@/components/ui/breadcrumb"

export default function AddPatientPage() {
  const router = useRouter()

  return (
    <DashboardShell>
      <Breadcrumb
        items={[
          { title: "Patients", href: "/patients" },
          { title: "Add Patient", href: "/patients/add" },
        ]}
        className="mb-2"
      />
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" onClick={() => router.back()} className="mr-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Patients
        </Button>
        <DashboardHeader heading="Add New Patient" text="Create a new patient and assign procedures." />
      </div>

      <AddPatientWizard />
    </DashboardShell>
  )
}
