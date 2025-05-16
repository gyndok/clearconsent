"use client"

import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, FileText, Mail, MessageSquare, Phone, User, Video, Edit, Plus } from "lucide-react"
import { Breadcrumb } from "@/components/ui/breadcrumb"

// Mock data for a single patient
const patientData = {
  id: "1",
  firstName: "John",
  lastName: "Smith",
  email: "john.smith@example.com",
  phone: "(555) 123-4567",
  dateOfBirth: "1985-06-15",
  gender: "Male",
  address: "123 Main St",
  city: "Boston",
  state: "MA",
  zipCode: "02108",
  dateAdded: "2025-01-05",
  status: "Active",
  assignedProcedures: [
    {
      id: "1",
      title: "Knee Arthroscopy",
      description: "Minimally invasive knee surgery",
      assignedDate: "2025-01-10",
      status: "Completed",
      completedDate: "2025-01-15",
      hasVideo: true,
      hasPDF: true,
    },
    {
      id: "2",
      title: "Physical Therapy Consent",
      description: "Consent for post-surgery rehabilitation",
      assignedDate: "2025-01-12",
      status: "In Progress",
      hasVideo: true,
      hasPDF: true,
    },
  ],
  messages: [
    {
      id: "1",
      date: "2025-01-11",
      content: "I have a question about the recovery process.",
      sender: "patient",
      read: true,
    },
    {
      id: "2",
      date: "2025-01-11",
      content: "What specifically would you like to know about recovery?",
      sender: "doctor",
      read: true,
    },
    {
      id: "3",
      date: "2025-01-12",
      content: "How long should I use crutches after the procedure?",
      sender: "patient",
      read: true,
    },
    {
      id: "4",
      date: "2025-01-12",
      content:
        "You should use crutches for 1-2 weeks, depending on your progress. We'll evaluate at your follow-up appointment.",
      sender: "doctor",
      read: true,
    },
  ],
}

export default function PatientDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const patient = patientData // In a real app, this would be fetched based on params.id

  return (
    <DashboardShell>
      <Breadcrumb
        items={[
          { title: "Patients", href: "/patients" },
          { title: `${patient.firstName} ${patient.lastName}`, href: `/patients/${patient.id}` },
        ]}
        className="mb-2"
      />
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="mr-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <DashboardHeader
            heading={`${patient.firstName} ${patient.lastName}`}
            text="Patient details and assigned procedures."
          />
        </div>
        <Button onClick={() => router.push(`/patients/${patient.id}/edit`)} variant="outline">
          <Edit className="mr-2 h-4 w-4" />
          Edit Patient
        </Button>
      </div>

      <div className="grid gap-6">
        <div className="flex flex-col md:flex-row gap-6">
          <Card className="flex-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Patient Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Full Name</h3>
                <p>
                  {patient.firstName} {patient.lastName}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Date of Birth</h3>
                <p>{new Date(patient.dateOfBirth).toLocaleDateString()}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Gender</h3>
                <p>{patient.gender}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Date Added</h3>
                <p>{new Date(patient.dateAdded).toLocaleDateString()}</p>
              </div>
              <div className="md:col-span-2">
                <h3 className="text-sm font-medium text-muted-foreground">Address</h3>
                <p>
                  {patient.address}, {patient.city}, {patient.state} {patient.zipCode}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="flex-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                <div className="flex items-center">
                  <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                  <p>{patient.email}</p>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Phone</h3>
                <div className="flex items-center">
                  <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                  <p>{patient.phone}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="procedures" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="procedures">Assigned Procedures</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
          </TabsList>

          <TabsContent value="procedures" className="space-y-4 pt-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Assigned Procedures</h2>
              <Button onClick={() => router.push(`/patients/${patient.id}/assign`)}>
                <Plus className="mr-2 h-4 w-4" />
                Assign Procedure
              </Button>
            </div>

            {patient.assignedProcedures.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground">No procedures assigned yet.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {patient.assignedProcedures.map((procedure) => (
                  <Card key={procedure.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{procedure.title}</CardTitle>
                        <Badge
                          variant="secondary"
                          className={`${
                            procedure.status === "Completed"
                              ? "bg-green-500"
                              : procedure.status === "In Progress"
                                ? "bg-blue-500"
                                : "bg-gray-500"
                          } text-white`}
                        >
                          {procedure.status}
                        </Badge>
                      </div>
                      <CardDescription>{procedure.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <FileText className="h-4 w-4" />
                          <span>PDF</span>
                        </div>
                        {procedure.hasVideo && (
                          <div className="flex items-center gap-1">
                            <Video className="h-4 w-4" />
                            <span>Video</span>
                          </div>
                        )}
                      </div>
                      <div className="mt-3 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4" />
                          Assigned: {new Date(procedure.assignedDate).toLocaleDateString()}
                        </div>
                        {procedure.completedDate && (
                          <div className="flex items-center mt-1">
                            <Calendar className="mr-2 h-4 w-4" />
                            Completed: {new Date(procedure.completedDate).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="messages" className="space-y-4 pt-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Messages</h2>
              <Button onClick={() => router.push(`/patients/${patient.id}/message`)}>
                <MessageSquare className="mr-2 h-4 w-4" />
                New Message
              </Button>
            </div>

            <Card>
              <CardContent className="p-6">
                {patient.messages.length === 0 ? (
                  <p className="text-center text-muted-foreground">No messages yet.</p>
                ) : (
                  <div className="space-y-4">
                    {patient.messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === "doctor" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            message.sender === "doctor" ? "bg-primary text-primary-foreground" : "bg-muted"
                          }`}
                        >
                          <p>{message.content}</p>
                          <p className="text-xs mt-1 opacity-70">{new Date(message.date).toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-6 flex gap-2">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  />
                  <Button>Send</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardShell>
  )
}
