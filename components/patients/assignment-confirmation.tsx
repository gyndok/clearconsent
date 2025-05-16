"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Video, Mail, MessageSquare, Check, AlertCircle } from "lucide-react"

// Mock data for procedures
const procedures = [
  {
    id: "1",
    title: "Knee Arthroscopy",
    description: "Minimally invasive knee surgery",
    hasVideo: true,
    hasPDF: true,
    category: "Orthopedic",
  },
  {
    id: "2",
    title: "Cataract Surgery",
    description: "Removal of the lens of the eye",
    hasVideo: true,
    hasPDF: true,
    category: "Ophthalmology",
  },
  {
    id: "3",
    title: "Colonoscopy",
    description: "Examination of the large intestine",
    hasVideo: false,
    hasPDF: true,
    category: "Gastroenterology",
  },
  {
    id: "4",
    title: "Dental Implant",
    description: "Artificial tooth root placement",
    hasVideo: true,
    hasPDF: true,
    category: "Dental",
  },
  {
    id: "5",
    title: "Carpal Tunnel Release",
    description: "Surgery to treat carpal tunnel syndrome",
    hasVideo: false,
    hasPDF: true,
    category: "Orthopedic",
  },
  {
    id: "6",
    title: "Tonsillectomy",
    description: "Surgical removal of the tonsils",
    hasVideo: true,
    hasPDF: true,
    category: "ENT",
  },
  {
    id: "7",
    title: "Appendectomy",
    description: "Surgical removal of the appendix",
    hasVideo: true,
    hasPDF: true,
    category: "General Surgery",
  },
  {
    id: "8",
    title: "Hernia Repair",
    description: "Surgical correction of a hernia",
    hasVideo: true,
    hasPDF: true,
    category: "General Surgery",
  },
  {
    id: "9",
    title: "Hysterectomy",
    description: "Surgical removal of the uterus",
    hasVideo: true,
    hasPDF: true,
    category: "Gynecology",
  },
  {
    id: "10",
    title: "Rhinoplasty",
    description: "Surgical modification of the nose",
    hasVideo: true,
    hasPDF: true,
    category: "Plastic Surgery",
  },
]

interface AssignmentConfirmationProps {
  patient: any
  selectedProcedures: string[]
  sendNotification: boolean
  notificationMethod: string
  customMessage?: string
}

export function AssignmentConfirmation({
  patient,
  selectedProcedures,
  sendNotification,
  notificationMethod,
  customMessage,
}: AssignmentConfirmationProps) {
  // Get the full procedure objects for the selected IDs
  const procedureDetails = procedures.filter((procedure) => selectedProcedures.includes(procedure.id))

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Confirm Assignment</h3>
        <p className="text-sm text-muted-foreground">
          Please review the information below before assigning these procedures.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Patient Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="text-sm font-medium">Name</p>
              <p>
                {patient.firstName} {patient.lastName}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Email</p>
              <p>{patient.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Phone</p>
              <p>{patient.phone}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Notification Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {sendNotification ? (
              <>
                <div className="flex items-center text-green-600">
                  <Check className="mr-2 h-4 w-4" />
                  <p>Notifications will be sent</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Method</p>
                  <div className="flex items-center gap-2 mt-1">
                    {(notificationMethod === "email" || notificationMethod === "both") && (
                      <Badge className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        Email
                      </Badge>
                    )}
                    {(notificationMethod === "sms" || notificationMethod === "both") && (
                      <Badge className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" />
                        SMS
                      </Badge>
                    )}
                  </div>
                </div>
                {customMessage && (
                  <div>
                    <p className="text-sm font-medium">Custom Message</p>
                    <p className="text-sm italic border-l-2 pl-2 mt-1">{customMessage}</p>
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center text-amber-600">
                <AlertCircle className="mr-2 h-4 w-4" />
                <p>No notifications will be sent</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Selected Procedures</CardTitle>
          <CardDescription>
            The following {procedureDetails.length} procedure{procedureDetails.length > 1 ? "s" : ""} will be assigned
            to this patient.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {procedureDetails.map((procedure) => (
              <div key={procedure.id} className="flex items-start justify-between border-b pb-3 last:border-0">
                <div>
                  <h4 className="font-medium">{procedure.title}</h4>
                  <p className="text-sm text-muted-foreground">{procedure.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">Category: {procedure.category}</p>
                </div>
                <div className="flex space-x-1">
                  {procedure.hasPDF && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      PDF
                    </Badge>
                  )}
                  {procedure.hasVideo && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Video className="h-3 w-3" />
                      Video
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="rounded-lg border p-4 bg-muted/50">
        <p className="text-sm">
          By clicking "Assign Procedures", these procedures will be assigned to the patient
          {sendNotification ? " and they will be notified via the selected method" : ""}.
        </p>
      </div>
    </div>
  )
}
