"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
import { Icons } from "@/components/icons"
import { ProcedureSelectionList } from "./procedure-selection-list"
import { AssignmentPreview } from "./assignment-preview"
import { AssignmentConfirmation } from "./assignment-confirmation"

// Define the form schema
const formSchema = z.object({
  procedures: z.array(z.string()).min(1, "Please select at least one procedure."),
  sendNotification: z.boolean().default(true),
  notificationMethod: z.enum(["email", "sms", "both"]).default("email"),
  customMessage: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface PatientAssignmentFormProps {
  patient: any
}

export function PatientAssignmentForm({ patient }: PatientAssignmentFormProps) {
  const [activeTab, setActiveTab] = useState("select")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      procedures: [],
      sendNotification: true,
      notificationMethod: "email",
      customMessage: "",
    },
  })

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true)

    try {
      // In a real app, this would be an API call to assign procedures
      console.log("Assigning procedures:", data)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Show success message
      toast({
        title: "Procedures assigned successfully",
        description: `${data.procedures.length} procedure(s) have been assigned to ${patient.firstName} ${patient.lastName}.`,
      })

      // Redirect to patient details page
      router.push(`/patients/${patient.id}`)
    } catch (error) {
      console.error("Error assigning procedures:", error)
      toast({
        title: "Error assigning procedures",
        description: "There was an error assigning the procedures. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleTabChange = (value: string) => {
    // Only allow proceeding to preview if at least one procedure is selected
    if (value === "preview" && form.getValues().procedures.length === 0) {
      form.setError("procedures", {
        type: "manual",
        message: "Please select at least one procedure before proceeding.",
      })
      return
    }

    // Only allow proceeding to confirm if form is valid
    if (value === "confirm") {
      const isValid = form.trigger()
      if (!isValid) {
        return
      }
    }

    setActiveTab(value)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="select">Select Procedures</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="confirm">Confirm & Send</TabsTrigger>
            </TabsList>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <TabsContent value="select" className="py-4 space-y-6">
                  <FormField
                    control={form.control}
                    name="procedures"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Available Procedures</FormLabel>
                        <FormDescription>
                          Select the procedures you want to assign to {patient.firstName} {patient.lastName}.
                        </FormDescription>
                        <FormControl>
                          <ProcedureSelectionList
                            value={field.value}
                            onChange={field.onChange}
                            excludeIds={patient.assignedProcedures}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-between mt-6">
                    <Button variant="outline" onClick={() => router.back()}>
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      onClick={() => handleTabChange("preview")}
                      disabled={form.getValues().procedures.length === 0}
                    >
                      Continue to Preview
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="preview" className="py-4 space-y-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium">Notification Settings</h3>
                      <p className="text-sm text-muted-foreground">
                        Configure how the patient will be notified about these procedures.
                      </p>
                    </div>

                    <FormField
                      control={form.control}
                      name="sendNotification"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Send Notification</FormLabel>
                            <FormDescription>Notify the patient about the newly assigned procedures.</FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    {form.watch("sendNotification") && (
                      <>
                        <FormField
                          control={form.control}
                          name="notificationMethod"
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormLabel>Notification Method</FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  className="flex flex-col space-y-1"
                                >
                                  <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="email" />
                                    </FormControl>
                                    <FormLabel className="font-normal">Email</FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="sms" />
                                    </FormControl>
                                    <FormLabel className="font-normal">SMS</FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="both" />
                                    </FormControl>
                                    <FormLabel className="font-normal">Both Email and SMS</FormLabel>
                                  </FormItem>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="customMessage"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Custom Message (Optional)</FormLabel>
                              <FormDescription>
                                Add a personalized message to include with the notification.
                              </FormDescription>
                              <FormControl>
                                <Textarea
                                  placeholder="Example: Please review these procedures before your appointment next week."
                                  className="resize-none"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </>
                    )}

                    <div className="border rounded-lg p-4 mt-6">
                      <h3 className="text-lg font-medium mb-4">Preview</h3>
                      <AssignmentPreview
                        patient={patient}
                        selectedProcedures={form.getValues().procedures}
                        notificationMethod={form.watch("notificationMethod")}
                        customMessage={form.watch("customMessage")}
                      />
                    </div>

                    <div className="flex justify-between mt-6">
                      <Button variant="outline" onClick={() => setActiveTab("select")}>
                        Back to Selection
                      </Button>
                      <Button type="button" onClick={() => handleTabChange("confirm")}>
                        Continue to Confirmation
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="confirm" className="py-4 space-y-6">
                  <AssignmentConfirmation
                    patient={patient}
                    selectedProcedures={form.getValues().procedures}
                    sendNotification={form.watch("sendNotification")}
                    notificationMethod={form.watch("notificationMethod")}
                    customMessage={form.watch("customMessage")}
                  />

                  <div className="flex justify-between mt-6">
                    <Button variant="outline" onClick={() => setActiveTab("preview")}>
                      Back to Preview
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" /> Assigning...
                        </>
                      ) : (
                        "Assign Procedures"
                      )}
                    </Button>
                  </div>
                </TabsContent>
              </form>
            </Form>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
