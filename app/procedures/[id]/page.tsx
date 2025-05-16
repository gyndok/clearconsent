"use client"

import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, FileText, Video, Edit, Users, Clock, Download, ExternalLink } from "lucide-react"
import { ProcedureUsageStats } from "@/components/procedures/procedure-usage-stats"
import { ProcedureAssignmentHistory } from "@/components/procedures/procedure-assignment-history"
import { Breadcrumb } from "@/components/ui/breadcrumb"

// Mock data for a single procedure
const procedureData = {
  id: "1",
  title: "Knee Arthroscopy",
  description:
    "Knee arthroscopy is a surgical procedure that allows doctors to view the knee joint without making a large incision through the skin and other soft tissues. During knee arthroscopy, your surgeon inserts a small camera, called an arthroscope, into your knee joint.",
  category: "Orthopedic",
  hasVideo: true,
  hasPDF: true,
  videoUrl: "https://example.com/videos/knee-arthroscopy.mp4",
  pdfUrl: "https://example.com/pdfs/knee-arthroscopy.pdf",
  dateCreated: "2025-01-05",
  lastUpdated: "2025-01-15",
  createdBy: "Dr. Jane Smith",
  estimatedDuration: 30, // minutes
  assignedCount: 15,
  completedCount: 12,
  inProgressCount: 2,
  viewedCount: 1,
  assignmentHistory: [
    {
      id: "1",
      patientName: "John Doe",
      patientId: "p1",
      assignedDate: "2025-01-10",
      status: "Completed",
      completedDate: "2025-01-15",
    },
    {
      id: "2",
      patientName: "Sarah Johnson",
      patientId: "p2",
      assignedDate: "2025-01-12",
      status: "In Progress",
    },
    {
      id: "3",
      patientName: "Michael Brown",
      patientId: "p3",
      assignedDate: "2025-01-14",
      status: "Viewed",
    },
    {
      id: "4",
      patientName: "Emily Davis",
      patientId: "p4",
      assignedDate: "2025-01-18",
      status: "Completed",
      completedDate: "2025-01-20",
    },
    {
      id: "5",
      patientName: "Robert Wilson",
      patientId: "p5",
      assignedDate: "2025-01-20",
      status: "Completed",
      completedDate: "2025-01-22",
    },
  ],
}

export default function ProcedureDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const procedure = procedureData // In a real app, this would be fetched based on params.id

  return (
    <DashboardShell>
      <Breadcrumb
        items={[
          { title: "Procedures", href: "/procedures" },
          { title: procedure.title, href: `/procedures/${params.id}` },
        ]}
        className="mb-2"
      />
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="mr-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <DashboardHeader heading={procedure.title} text={procedure.description} />
        </div>
        <div className="flex gap-2">
          <Button onClick={() => router.push(`/procedures/${procedure.id}/edit`)} variant="outline">
            <Edit className="mr-2 h-4 w-4" />
            Edit Procedure
          </Button>
          <Button onClick={() => router.push(`/procedures/${procedure.id}/record-video`)}>
            <Video className="mr-2 h-4 w-4" />
            Record Video
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        <div className="flex flex-col md:flex-row gap-6">
          <Card className="flex-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Procedure Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Category</h3>
                <Badge variant="outline" className="mt-1">
                  {procedure.category}
                </Badge>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Created By</h3>
                <p>{procedure.createdBy}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Date Created</h3>
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                  {new Date(procedure.dateCreated).toLocaleDateString()}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Last Updated</h3>
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                  {new Date(procedure.lastUpdated).toLocaleDateString()}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Estimated Duration</h3>
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                  {procedure.estimatedDuration} minutes
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Total Assignments</h3>
                <div className="flex items-center">
                  <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                  {procedure.assignedCount} patients
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="flex-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="h-5 w-5" />
                Media & Materials
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {procedure.hasVideo && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Video Explanation</h3>
                  <div className="aspect-video bg-muted rounded-md flex items-center justify-center relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Button variant="outline" className="bg-background/80">
                        <Video className="mr-2 h-4 w-4" />
                        Play Video
                      </Button>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-2">
                    <Button variant="outline" size="sm">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Open in New Tab
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </div>
              )}

              {procedure.hasPDF && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">PDF Document</h3>
                  <div className="border rounded-md p-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <FileText className="h-8 w-8 text-muted-foreground mr-3" />
                      <div>
                        <p className="font-medium">{procedure.title} - Information Sheet</p>
                        <p className="text-sm text-muted-foreground">PDF Document</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {!procedure.hasVideo && !procedure.hasPDF && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No media or materials available for this procedure.</p>
                  <div className="flex justify-center gap-2 mt-4">
                    <Button variant="outline" size="sm" onClick={() => router.push(`/procedures/${procedure.id}/edit`)}>
                      <FileText className="mr-2 h-4 w-4" />
                      Add PDF
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/procedures/${procedure.id}/record-video`)}
                    >
                      <Video className="mr-2 h-4 w-4" />
                      Record Video
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="usage" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="usage">Usage Statistics</TabsTrigger>
            <TabsTrigger value="history">Assignment History</TabsTrigger>
          </TabsList>

          <TabsContent value="usage" className="space-y-4 pt-4">
            <ProcedureUsageStats procedure={procedure} />
          </TabsContent>

          <TabsContent value="history" className="space-y-4 pt-4">
            <ProcedureAssignmentHistory procedure={procedure} />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardShell>
  )
}
