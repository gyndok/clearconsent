"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Stepper } from "@/components/ui/stepper"
import { PatientInfoForm } from "./patient-info-form"
import { PatientContactForm } from "./patient-contact-form"
import { AssignProceduresForm } from "./assign-procedures-form"
import { PatientSummary } from "./patient-summary"
import { toast } from "@/hooks/use-toast"

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
  assignedProcedures: z.array(z.string()).min(1, "Please assign at least one procedure."),
  sendInvitation: z.boolean().default(true),
  invitationMethod: z.enum(["email", "sms", "both"]).default("email"),
})

type FormValues = z.infer<typeof formSchema>

export function AddPatientWizard() {
  const [step, setStep] = useState(0)
  const router = useRouter()

  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      gender: "",
      email: "",
      phone: "",
      assignedProcedures: [],
      sendInvitation: true,
      invitationMethod: "email",
    },
  })

  const steps = [
    { title: "Patient Info", description: "Basic patient information" },
    { title: "Contact Details", description: "Contact information" },
    { title: "Assign Procedures", description: "Select procedures to assign" },
    { title: "Review & Confirm", description: "Review and confirm details" },
  ]

  const nextStep = async () => {
    const fields = getFieldsForStep(step)
    const isValid = await form.trigger(fields as any)

    if (isValid) {
      setStep((prev) => Math.min(prev + 1, steps.length - 1))
    }
  }

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 0))
  }

  const getFieldsForStep = (stepIndex: number) => {
    switch (stepIndex) {
      case 0:
        return ["firstName", "lastName", "dateOfBirth", "gender"]
      case 1:
        return ["email", "phone", "address", "city", "state", "zipCode"]
      case 2:
        return ["assignedProcedures", "sendInvitation", "invitationMethod"]
      default:
        return []
    }
  }

  const onSubmit = async (data: FormValues) => {
    try {
      // In a real app, this would be an API call to create the patient
      console.log("Submitting patient data:", data)

      // Show success message
      toast({
        title: "Patient added successfully",
        description: `${data.firstName} ${data.lastName} has been added and assigned ${data.assignedProcedures.length} procedure(s).`,
      })

      // Redirect to patients list
      router.push("/patients")
    } catch (error) {
      console.error("Error adding patient:", error)
      toast({
        title: "Error adding patient",
        description: "There was an error adding the patient. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Stepper
        steps={steps}
        activeStep={step}
        onStepClick={(index) => {
          // Only allow clicking on previous steps or the current step
          if (index <= step) {
            setStep(index)
          }
        }}
        className="mb-8"
      />

      <Card>
        <CardContent className="pt-6">
          {step === 0 && <PatientInfoForm form={form} />}
          {step === 1 && <PatientContactForm form={form} />}
          {step === 2 && <AssignProceduresForm form={form} />}
          {step === 3 && <PatientSummary form={form} />}

          <div className="flex justify-between mt-8">
            {step > 0 ? (
              <Button type="button" variant="outline" onClick={prevStep}>
                Previous
              </Button>
            ) : (
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
            )}

            {step < steps.length - 1 ? (
              <Button type="button" onClick={nextStep}>
                Next
              </Button>
            ) : (
              <Button type="button" onClick={form.handleSubmit(onSubmit)}>
                Add Patient
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
