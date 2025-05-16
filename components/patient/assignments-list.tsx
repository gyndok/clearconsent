"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, FileText, Video, Clock, CheckCircle, Eye } from "lucide-react"

// Mock data for patient assignments
const assignments = [
  {
    id: "1",
    title: "Knee Arthroscopy",
    description: "Minimally invasive knee surgery",
    assignedDate: "2025-01-10",
    dueDate: "2025-01-20",
    status: "Completed",
    hasVideo: true,
    hasPDF: true,
  },
  {
    id: "2",
    title: "Physical Therapy Consent",
    description: "Consent for post-surgery rehabilitation",
    assignedDate: "2025-01-12",
    dueDate: "2025-01-22",
    status: "In Progress",
    hasVideo: true,
    hasPDF: true,
    progress: 60,
  },
  {
    id: "3",
    title: "Pain Management Protocol",
    description: "Information about pain management after surgery",
    assignedDate: "2025-01-12",
    dueDate: "2025-01-22",
    status: "Viewed",
    hasVideo: false,
    hasPDF: true,
  },
  {
    id: "4",
    title: "Post-Operative Care",
    description: "Instructions for care after your procedure",
    assignedDate: "2025-01-15",
    dueDate: "2025-01-25",
    status: "Sent",
    hasVideo: true,
    hasPDF: true,
  },
  {
    id: "5",
    title: "Follow-up Appointment",
    description: "Information about your follow-up appointment",
    assignedDate: "2025-01-18",
    dueDate: "2025-01-28",
    status: "Sent",
    hasVideo: false,
    hasPDF: true,
  },
]

export function AssignmentsList() {
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const filteredAssignments = assignments.filter(
    (assignment) =>
      assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assignment.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "In Progress":
        return <Clock className="h-5 w-5 text-blue-500" />
      case "Viewed":
        return <Eye className="h-5 w-5 text-yellow-500" />
      case "Sent":
        return <FileText className="h-5 w-5 text-gray-500" />
      default:
        return <FileText className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-500"
      case "In Progress":
        return "bg-blue-500"
      case "Viewed":
        return "bg-yellow-500"
      case "Sent":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  const getButtonText = (status: string) => {
    switch (status) {
      case "Completed":
        return "Review"
      case "In Progress":
        return "Continue"
      case "Viewed":
        return "Continue"
      case "Sent":
        return "Start"
      default:
        return "Open"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search assignments..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-9 w-full max-w-sm"
        />
      </div>

      {filteredAssignments.length === 0 ? (
        <div className="text-center p-8 border rounded-lg">
          <p className="text-muted-foreground">No assignments found.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredAssignments.map((assignment) => (
            <Card key={assignment.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{assignment.title}</CardTitle>
                  <Badge variant="secondary" className={`${getStatusColor(assignment.status)} text-white`}>
                    {assignment.status}
                  </Badge>
                </div>
                <CardDescription>{assignment.description}</CardDescription>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <FileText className="h-4 w-4" />
                    <span>PDF</span>
                  </div>
                  {assignment.hasVideo && (
                    <div className="flex items-center gap-1">
                      <Video className="h-4 w-4" />
                      <span>Video</span>
                    </div>
                  )}
                </div>
                <div className="mt-3 text-sm text-muted-foreground">
                  <p>Assigned: {new Date(assignment.assignedDate).toLocaleDateString()}</p>
                  <p>Due: {new Date(assignment.dueDate).toLocaleDateString()}</p>
                </div>
                {assignment.status === "In Progress" && assignment.progress !== undefined && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span>Progress</span>
                      <span>{assignment.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${assignment.progress}%` }}></div>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={() => router.push(`/patient/assignments/${assignment.id}`)}>
                  {getButtonText(assignment.status)}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
