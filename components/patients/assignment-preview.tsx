"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mail, MessageSquare, FileText, Video } from "lucide-react"

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

interface AssignmentPreviewProps {
  patient: any
  selectedProcedures: string[]
  notificationMethod: string
  customMessage?: string
}

export function AssignmentPreview({
  patient,
  selectedProcedures,
  notificationMethod,
  customMessage,
}: AssignmentPreviewProps) {
  // Get the full procedure objects for the selected IDs
  const procedureDetails = procedures.filter((procedure) => selectedProcedures.includes(procedure.id))

  return (
    <div className="space-y-4">
      <Tabs defaultValue="email" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="email" disabled={notificationMethod === "sms"}>
            <Mail className="mr-2 h-4 w-4" />
            Email Preview
          </TabsTrigger>
          <TabsTrigger value="sms" disabled={notificationMethod === "email"}>
            <MessageSquare className="mr-2 h-4 w-4" />
            SMS Preview
          </TabsTrigger>
        </TabsList>

        <TabsContent value="email" className="space-y-4 pt-4">
          <Card className="border border-dashed">
            <CardContent className="p-4">
              <div className="space-y-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">To: {patient.email}</p>
                  <p className="text-sm text-muted-foreground">Subject: New Procedure Assignments from ClearConsent</p>
                </div>
                <div className="space-y-4 pt-2">
                  <p>Hello {patient.firstName},</p>
                  <p>
                    Your healthcare provider has assigned {procedureDetails.length} new procedure
                    {procedureDetails.length > 1 ? "s" : ""} for you to review and provide consent.
                  </p>

                  {customMessage && (
                    <div className="border-l-4 border-primary pl-4 italic">
                      <p>{customMessage}</p>
                    </div>
                  )}

                  <div>
                    <p className="font-medium mb-2">Assigned Procedures:</p>
                    <ul className="list-disc pl-5 space-y-2">
                      {procedureDetails.map((procedure) => (
                        <li key={procedure.id}>
                          <span className="font-medium">{procedure.title}</span> - {procedure.description}
                          <div className="flex mt-1 space-x-2">
                            {procedure.hasPDF && (
                              <Badge variant="outline" className="text-xs">
                                <FileText className="mr-1 h-3 w-3" />
                                PDF Document
                              </Badge>
                            )}
                            {procedure.hasVideo && (
                              <Badge variant="outline" className="text-xs">
                                <Video className="mr-1 h-3 w-3" />
                                Video
                              </Badge>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <p>
                    Please log in to your ClearConsent patient portal to review these procedures and provide your
                    consent.
                  </p>

                  <div className="bg-primary text-primary-foreground text-center py-3 px-4 rounded-md">
                    Log in to Patient Portal
                  </div>

                  <p className="text-sm text-muted-foreground">
                    If you have any questions, please contact your healthcare provider directly.
                  </p>

                  <p>Thank you,</p>
                  <p>The ClearConsent Team</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sms" className="space-y-4 pt-4">
          <Card className="border border-dashed">
            <CardContent className="p-4">
              <div className="space-y-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">To: {patient.phone}</p>
                </div>
                <div className="space-y-4 pt-2">
                  <p>
                    Hello {patient.firstName}, your healthcare provider has assigned {procedureDetails.length} new
                    procedure{procedureDetails.length > 1 ? "s" : ""} for you to review:
                    {procedureDetails.map((p) => p.title).join(", ")}.{customMessage ? ` ${customMessage}` : ""} Please
                    log in to your ClearConsent patient portal to review and provide consent: [login link]
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
