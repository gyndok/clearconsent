"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { PatientDashboardHeader } from "@/components/patient/patient-dashboard-header"
import { PatientDashboardShell } from "@/components/patient/patient-dashboard-shell"
import { ArrowLeft, FileText, MessageSquare, Video } from "lucide-react"

export default function AssignmentDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("information")

  // Mock data - in a real app, this would be fetched based on the ID
  const assignment = {
    id: params.id,
    title: "Knee Arthroscopy",
    description: "Minimally invasive knee surgery",
    status: "In Progress",
    videoUrl: "https://example.com/video",
    pdfUrl: "https://example.com/document.pdf",
    doctor: "Dr. Jane Smith",
    department: "Orthopedics",
    content: `
      <h2>About the Procedure</h2>
      <p>Knee arthroscopy is a surgical procedure that allows doctors to view the knee joint without making a large incision through the skin and other soft tissues.</p>
      
      <h3>Preparation</h3>
      <p>Before your knee arthroscopy, you should:</p>
      <ul>
        <li>Tell your doctor about any medications or supplements you take</li>
        <li>Stop taking certain medications if instructed</li>
        <li>Arrange for someone to drive you home after the procedure</li>
        <li>Follow fasting guidelines as provided</li>
      </ul>
      
      <h3>During the Procedure</h3>
      <p>During knee arthroscopy, your surgeon inserts a small camera, called an arthroscope, into your knee joint. The camera displays pictures on a video monitor, and your surgeon uses these images to guide miniature surgical instruments.</p>
      
      <h3>Recovery</h3>
      <p>After your knee arthroscopy, you'll be moved to a recovery room for observation. Before you leave, you'll be given instructions on how to care for your incisions, what activities you should avoid, and for how long.</p>
    `,
  }

  return (
    <PatientDashboardShell>
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" onClick={() => router.back()} className="mr-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <PatientDashboardHeader heading={assignment.title} text={assignment.description} />
        <Badge className="ml-4 bg-blue-500 text-white">{assignment.status}</Badge>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between mb-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Assigned by</p>
                <p className="font-medium">{assignment.doctor}</p>
                <p className="text-sm text-muted-foreground">{assignment.department}</p>
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="information">Information</TabsTrigger>
                <TabsTrigger value="materials">Materials</TabsTrigger>
                <TabsTrigger value="messages">Messages</TabsTrigger>
              </TabsList>
              <TabsContent value="information" className="mt-6">
                <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: assignment.content }} />
              </TabsContent>
              <TabsContent value="materials" className="mt-6">
                <div className="space-y-4">
                  {assignment.videoUrl && (
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <Video className="h-5 w-5 mr-2" />
                        <h3 className="font-medium">Procedure Video</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        Watch this video to learn more about the procedure.
                      </p>
                      <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                        <p className="text-muted-foreground">Video Player Placeholder</p>
                      </div>
                    </div>
                  )}

                  {assignment.pdfUrl && (
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <FileText className="h-5 w-5 mr-2" />
                        <h3 className="font-medium">Procedure Document</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        Review this document for detailed information.
                      </p>
                      <Button>View Document</Button>
                    </div>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="messages" className="mt-6">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center mb-4">
                    <MessageSquare className="h-5 w-5 mr-2" />
                    <h3 className="font-medium">Questions for your doctor</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    If you have any questions about this procedure, you can ask your doctor here.
                  </p>
                  <textarea
                    className="w-full min-h-[100px] p-3 border rounded-md mb-4"
                    placeholder="Type your question here..."
                  ></textarea>
                  <Button>Send Message</Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button variant="outline" onClick={() => router.back()}>
            Save Progress
          </Button>
          <Button>Complete & Sign</Button>
        </div>
      </div>
    </PatientDashboardShell>
  )
}
