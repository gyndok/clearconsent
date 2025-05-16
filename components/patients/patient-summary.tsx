"use client"

import type { UseFormReturn } from "react-hook-form"
import { format } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Mail, MessageSquare, Phone, User, Video } from "lucide-react"

// Mock data for procedures (same as in assign-procedures-form.tsx)
const procedures = [
  {
    id: "1",
    title: "Knee Arthroscopy",
    description: "Minimally invasive knee surgery",
    hasVideo: true,
    hasPDF: true,
  },
  {
    id: "2",
    title: "Cataract Surgery",
    description: "Removal of the lens of the eye",
    hasVideo: true,
    hasPDF: true,
  },
  {
    id: "3",
    title: "Colonoscopy",
    description: "Examination of the large intestine",
    hasVideo: false,
    hasPDF: true,
  },
  {
    id: "4",
    title: "Dental Implant",
    description: "Artificial tooth root placement",
    hasVideo: true,
    hasPDF: true,
  },
  {
    id: "5",
    title: "Carpal Tunnel Release",
    description: "Surgery to treat carpal tunnel syndrome",
    hasVideo: false,
    hasPDF: true,
  },
  {
    id: "6",
    title: "Tonsillectomy",
    description: "Surgical removal of the tonsils",
    hasVideo: true,
    hasPDF: true,
  },
  {
    id: "7",
    title: "Appendectomy",
    description: "Surgical removal of the appendix",
    hasVideo: true,
    hasPDF: true,
  },
]

interface PatientSummaryProps {
  form: UseFormReturn<any>
}

export function PatientSummary({ form }: PatientSummaryProps) {
  const formValues = form.getValues()

  const assignedProcedureDetails = procedures.filter((procedure) =>
    formValues.assignedProcedures.includes(procedure.id),
  )

  const getInvitationMethodText = (method: string) => {
    switch (method) {
      case "email":
        return "Email"
      case "sms":
        return "SMS"
      case "both":
        return "Email and SMS"
      default:
        return "None"
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Review & Confirm</h2>
      <p className="text-muted-foreground">
        Please review the patient information and assigned procedures before adding the patient.
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Patient Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium">Name</h3>
              <p>
                {formValues.firstName} {formValues.lastName}
              </p>
            </div>

            <div>
              <h3 className="font-medium">Date of Birth</h3>
              <p>{formValues.dateOfBirth ? format(formValues.dateOfBirth, "PPP") : "Not provided"}</p>
            </div>

            <div>
              <h3 className="font-medium">Gender</h3>
              <p>{formValues.gender}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium">Email</h3>
              <p>{formValues.email}</p>
            </div>

            <div>
              <h3 className="font-medium">Phone</h3>
              <p>{formValues.phone}</p>
            </div>

            {formValues.address && (
              <div>
                <h3 className="font-medium">Address</h3>
                <p>
                  {formValues.address}
                  {formValues.city && `, ${formValues.city}`}
                  {formValues.state && `, ${formValues.state}`}
                  {formValues.zipCode && ` ${formValues.zipCode}`}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Assigned Procedures
          </CardTitle>
        </CardHeader>
        <CardContent>
          {assignedProcedureDetails.length === 0 ? (
            <p className="text-muted-foreground">No procedures assigned.</p>
          ) : (
            <div className="space-y-4">
              {assignedProcedureDetails.map((procedure) => (
                <div key={procedure.id} className="flex items-start justify-between border-b pb-3 last:border-0">
                  <div>
                    <h3 className="font-medium">{procedure.title}</h3>
                    <p className="text-sm text-muted-foreground">{procedure.description}</p>
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
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Invitation Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Send Invitation</h3>
              <p>{formValues.sendInvitation ? "Yes" : "No"}</p>
            </div>

            {formValues.sendInvitation && (
              <div>
                <h3 className="font-medium">Invitation Method</h3>
                <div className="flex items-center gap-2">
                  {formValues.invitationMethod === "email" || formValues.invitationMethod === "both" ? (
                    <Badge className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      Email
                    </Badge>
                  ) : null}

                  {formValues.invitationMethod === "sms" || formValues.invitationMethod === "both" ? (
                    <Badge className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      SMS
                    </Badge>
                  ) : null}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
