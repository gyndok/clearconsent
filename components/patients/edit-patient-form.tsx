"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PatientInfoForm } from "./patient-info-form"
import { PatientContactForm } from "./patient-contact-form"
import { AssignProceduresForm } from "./assign-procedures-form"
import { toast } from "@/hooks/use-toast"
import { Icons } from "@/components/icons"

// Define the schema for the entire form
const formSchema = z.object({
  // Patient Info
  firstName: z.string().min(2, "First name must be at least 2 characters."),
  lastName: z.string().min(2, "Last name must be at least 2 characters."),
  dateOfBirth: z.date({
    required_error: "Date of birth is required.",
  }),
  gender: z.string().min(1, "Please select a gender."),

  // Contact Info
  email: z.string().email("Please enter a valid email address."),
  phone: z.string().min(10, "Please enter a valid phone number."),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),

  // Assigned Procedures
  assignedProcedures: z.array(z.string()),
  sendNotification: z.boolean().default(false),
  notificationMethod: z.enum(["email", "sms", "both"]).default("email"),
})

type FormValues = z.infer<typeof formSchema>

interface EditPatientFormProps {
  patient: any
}

export function EditPatientForm({ patient }: EditPatientFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("info")
  const router = useRouter()

  // Initialize the form with patient data
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: patient.firstName,
      lastName: patient.lastName,
      dateOfBirth: patient.dateOfBirth,
      gender: patient.gender,
      email: patient.email,
      phone: patient.phone,
      address: patient.address || "",
      city: patient.city || "",
      state: patient.state || "",
      zipCode: patient.zipCode || "",
      assignedProcedures: patient.assignedProcedures || [],
      sendNotification: false,
      notificationMethod: "email",
    },
  })

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true)

    try {
      // In a real app, this would be an API call to update the patient
      console.log("Updating patient data:", data)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Show success message
      toast({
        title: "Patient updated successfully",
        description: `${data.firstName} ${data.lastName}'s information has been updated.`,
      })

      // Redirect to patient details page
      router.push(`/patients/${patient.id}`)
    } catch (error) {
      console.error("Error updating patient:", error)
      toast({
        title: "Error updating patient",
        description: "There was an error updating the patient. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="info">Personal Info</TabsTrigger>
              <TabsTrigger value="contact">Contact Details</TabsTrigger>
              <TabsTrigger value="procedures">Assigned Procedures</TabsTrigger>
            </TabsList>
            <TabsContent value="info" className="py-4">
              <PatientInfoForm form={form} />
              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={() => router.back()}>
                  Cancel
                </Button>
                <Button onClick={() => setActiveTab("contact")}>Next</Button>
              </div>
            </TabsContent>
            <TabsContent value="contact" className="py-4">
              <PatientContactForm form={form} />
              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={() => setActiveTab("info")}>
                  Previous
                </Button>
                <Button onClick={() => setActiveTab("procedures")}>Next</Button>
              </div>
            </TabsContent>
            <TabsContent value="procedures" className="py-4">
              <AssignProceduresForm form={form} isEditing={true} />
              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={() => setActiveTab("contact")}>
                  Previous
                </Button>
                <Button onClick={form.handleSubmit(onSubmit)} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" /> Updating...
                    </>
                  ) : (
                    "Update Patient"
                  )}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
