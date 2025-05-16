"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { EditPatientForm } from "@/components/patients/edit-patient-form"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/hooks/use-toast"
import { Breadcrumb } from "@/components/ui/breadcrumb"

// Mock function to fetch patient data - in a real app, this would be an API call
const fetchPatientData = async (id: string) => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Mock data for a single patient
  return {
    id,
    firstName: "John",
    lastName: "Smith",
    dateOfBirth: new Date("1985-06-15"),
    gender: "male",
    email: "john.smith@example.com",
    phone: "(555) 123-4567",
    address: "123 Main St",
    city: "Boston",
    state: "MA",
    zipCode: "02108",
    assignedProcedures: ["1", "2"], // IDs of assigned procedures
  }
}

export default function EditPatientPage({ params }: { params: { id: string } }) {
  const [patient, setPatient] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const getPatientData = async () => {
      try {
        setLoading(true)
        const data = await fetchPatientData(params.id)
        setPatient(data)
      } catch (err) {
        console.error("Error fetching patient data:", err)
        setError("Failed to load patient data. Please try again.")
        toast({
          title: "Error",
          description: "Failed to load patient data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    getPatientData()
  }, [params.id])

  if (error) {
    return (
      <DashboardShell>
        <Breadcrumb
          items={[
            { title: "Patients", href: "/patients" },
            { title: "Error", href: `/patients/${params.id}/edit` },
          ]}
          className="mb-2"
        />
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="mr-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <DashboardHeader heading="Error" text="There was a problem loading the patient data." />
        </div>
        <div className="flex flex-col items-center justify-center h-[400px]">
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </DashboardShell>
    )
  }

  if (loading || !patient) {
    return (
      <DashboardShell>
        <Breadcrumb
          items={[
            { title: "Patients", href: "/patients" },
            { title: "Loading...", href: `/patients/${params.id}/edit` },
          ]}
          className="mb-2"
        />
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" disabled className="mr-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <Skeleton className="h-8 w-[250px] mb-2" />
            <Skeleton className="h-4 w-[350px]" />
          </div>
        </div>
        <div className="space-y-6">
          <Skeleton className="h-[600px] w-full" />
        </div>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell>
      <Breadcrumb
        items={[
          { title: "Patients", href: "/patients" },
          { title: `${patient.firstName} ${patient.lastName}`, href: `/patients/${patient.id}` },
          { title: "Edit", href: `/patients/${patient.id}/edit` },
        ]}
        className="mb-2"
      />
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" onClick={() => router.back()} className="mr-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <DashboardHeader
          heading={`Edit Patient: ${patient.firstName} ${patient.lastName}`}
          text="Update patient information and preferences."
        />
      </div>

      <EditPatientForm patient={patient} />
    </DashboardShell>
  )
}
