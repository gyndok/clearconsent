"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/hooks/use-toast"
import { ProcedureForm } from "@/components/procedures/procedure-form"
import { Breadcrumb } from "@/components/ui/breadcrumb"

// Mock function to fetch procedure data - in a real app, this would be an API call
const fetchProcedureData = async (id: string) => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  // Mock data for a single procedure
  return {
    id,
    title: "Knee Arthroscopy",
    description:
      "Knee arthroscopy is a surgical procedure that allows doctors to view the knee joint without making a large incision through the skin and other soft tissues.",
    category: "Orthopedic",
    hasVideo: true,
    hasPDF: true,
    videoUrl: "https://example.com/videos/knee-arthroscopy.mp4",
    pdfUrl: "https://example.com/pdfs/knee-arthroscopy.pdf",
    estimatedDuration: 30, // minutes
  }
}

export default function EditProcedurePage({ params }: { params: { id: string } }) {
  const [procedure, setProcedure] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const getProcedureData = async () => {
      try {
        setLoading(true)
        const data = await fetchProcedureData(params.id)
        setProcedure(data)
      } catch (err) {
        console.error("Error fetching procedure data:", err)
        setError("Failed to load procedure data. Please try again.")
        toast({
          title: "Error",
          description: "Failed to load procedure data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    getProcedureData()
  }, [params.id])

  if (error) {
    return (
      <DashboardShell>
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="mr-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <DashboardHeader heading="Error" text="There was a problem loading the procedure data." />
        </div>
        <div className="flex flex-col items-center justify-center h-[400px]">
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </DashboardShell>
    )
  }

  if (loading || !procedure) {
    return (
      <DashboardShell>
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
          { title: "Procedures", href: "/procedures" },
          { title: procedure.title, href: `/procedures/${params.id}` },
          { title: "Edit", href: `/procedures/${params.id}/edit` },
        ]}
        className="mb-2"
      />
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" onClick={() => router.back()} className="mr-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <DashboardHeader
          heading={`Edit Procedure: ${procedure.title}`}
          text="Update procedure information and materials."
        />
      </div>

      <ProcedureForm procedure={procedure} isEditing />
    </DashboardShell>
  )
}
