"use client"

import { useState } from "react"
import Image from "next/image"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"

const formSchema = z.object({
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().optional(),
  procedure: z.string({
    required_error: "Please select a procedure.",
  }),
  message: z.string().optional(),
  sendMethod: z.enum(["email", "sms", "both", "manual"], {
    required_error: "Please select a send method.",
  }),
  includeQRCode: z.boolean().default(false),
})

type FormData = z.infer<typeof formSchema>

export function PatientInviteForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [invitationGenerated, setInvitationGenerated] = useState(false)
  const [invitationLink, setInvitationLink] = useState("")
  const [qrCodeUrl, setQrCodeUrl] = useState("")

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      procedure: "",
      message: "",
      sendMethod: "email",
      includeQRCode: false,
    },
  })

  async function onSubmit(values: FormData) {
    setIsLoading(true)

    try {
      // In a real app, we would call an API to generate the invitation
      console.log(values)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Generate a mock invitation link and QR code
      const token = Math.random().toString(36).substring(2, 15)
      const link = `https://clearconsent.app/patient/invitation/${token}`
      setInvitationLink(link)

      // Generate a mock QR code URL
      // In a real app, we would generate a QR code using a library or API
      setQrCodeUrl(`/placeholder.svg?height=200&width=200&query=QR%20Code%20for%20${encodeURIComponent(link)}`)

      setInvitationGenerated(true)

      toast({
        title: "Invitation generated",
        description: `Invitation for ${values.firstName} ${values.lastName} has been generated.`,
      })
    } catch (error) {
      toast({
        title: "Error generating invitation",
        description: "There was a problem generating the invitation. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(invitationLink)
    toast({
      title: "Link copied",
      description: "Invitation link has been copied to clipboard.",
    })
  }

  const handleSendInvitation = async () => {
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Invitation sent",
        description: `Invitation has been sent to ${form.getValues("email")}.`,
      })
    } catch (error) {
      toast({
        title: "Error sending invitation",
        description: "There was a problem sending the invitation. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    form.reset()
    setInvitationGenerated(false)
    setInvitationLink("")
    setQrCodeUrl("")
  }

  return (
    <Tabs defaultValue="invite" className="w-full">
      <TabsList className="grid w-full max-w-md grid-cols-2">
        <TabsTrigger value="invite">Invite Patient</TabsTrigger>
        <TabsTrigger value="bulk" disabled>
          Bulk Invite
        </TabsTrigger>
      </TabsList>
      <TabsContent value="invite">
        <Card>
          <CardHeader>
            <CardTitle>Patient Invitation</CardTitle>
            <CardDescription>Create an invitation link for a new patient to join ClearConsent</CardDescription>
          </CardHeader>
          <CardContent>
            {!invitationGenerated ? (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="john.doe@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="(555) 123-4567" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="procedure"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Procedure</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a procedure" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="knee-arthroscopy">Knee Arthroscopy</SelectItem>
                              <SelectItem value="cataract-surgery">Cataract Surgery</SelectItem>
                              <SelectItem value="colonoscopy">Colonoscopy</SelectItem>
                              <SelectItem value="wisdom-teeth-extraction">Wisdom Teeth Extraction</SelectItem>
                              <SelectItem value="hip-replacement">Hip Replacement</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Personal Message (Optional)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Add a personal message to your patient..."
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            This message will be included in the invitation email or SMS.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="sendMethod"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Send Method</FormLabel>
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
                                <FormLabel className="font-normal">Both Email & SMS</FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="manual" />
                                </FormControl>
                                <FormLabel className="font-normal">Generate link only (manual share)</FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="includeQRCode"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Generate QR Code</FormLabel>
                            <FormDescription>
                              Create a QR code that patients can scan with their phone camera
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                        Generating Invitation...
                      </>
                    ) : (
                      "Generate Invitation"
                    )}
                  </Button>
                </form>
              </Form>
            ) : (
              <div className="space-y-6">
                <div className="rounded-md border p-4">
                  <h3 className="text-lg font-medium">Invitation Details</h3>
                  <dl className="mt-2 divide-y divide-gray-200">
                    <div className="grid grid-cols-3 gap-4 py-3">
                      <dt className="text-sm font-medium text-gray-500">Patient</dt>
                      <dd className="col-span-2 text-sm">
                        {form.getValues("firstName")} {form.getValues("lastName")}
                      </dd>
                    </div>
                    <div className="grid grid-cols-3 gap-4 py-3">
                      <dt className="text-sm font-medium text-gray-500">Email</dt>
                      <dd className="col-span-2 text-sm">{form.getValues("email")}</dd>
                    </div>
                    {form.getValues("phone") && (
                      <div className="grid grid-cols-3 gap-4 py-3">
                        <dt className="text-sm font-medium text-gray-500">Phone</dt>
                        <dd className="col-span-2 text-sm">{form.getValues("phone")}</dd>
                      </div>
                    )}
                    <div className="grid grid-cols-3 gap-4 py-3">
                      <dt className="text-sm font-medium text-gray-500">Procedure</dt>
                      <dd className="col-span-2 text-sm capitalize">{form.getValues("procedure").replace("-", " ")}</dd>
                    </div>
                    <div className="grid grid-cols-3 gap-4 py-3">
                      <dt className="text-sm font-medium text-gray-500">Send Method</dt>
                      <dd className="col-span-2 text-sm capitalize">{form.getValues("sendMethod")}</dd>
                    </div>
                  </dl>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="mb-2 text-lg font-medium">Invitation Link</h3>
                    <div className="flex items-center space-x-2">
                      <Input value={invitationLink} readOnly className="font-mono text-sm" />
                      <Button variant="outline" size="icon" onClick={handleCopyLink}>
                        <Icons.copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {form.getValues("includeQRCode") && (
                    <div>
                      <h3 className="mb-2 text-lg font-medium">QR Code</h3>
                      <div className="flex justify-center">
                        <div className="overflow-hidden rounded-md border bg-white p-2">
                          <Image
                            src={qrCodeUrl || "/placeholder.svg"}
                            alt="QR Code"
                            width={200}
                            height={200}
                            className="h-48 w-48"
                          />
                        </div>
                      </div>
                      <div className="mt-2 text-center">
                        <Button variant="outline" size="sm">
                          <Icons.download className="mr-2 h-4 w-4" />
                          Download QR Code
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            {invitationGenerated ? (
              <>
                <Button variant="outline" onClick={resetForm}>
                  Create New Invitation
                </Button>
                {form.getValues("sendMethod") !== "manual" && (
                  <Button onClick={handleSendInvitation} disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Send Invitation"
                    )}
                  </Button>
                )}
              </>
            ) : null}
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="bulk">
        <Card>
          <CardHeader>
            <CardTitle>Bulk Invite Patients</CardTitle>
            <CardDescription>Upload a CSV file to invite multiple patients at once</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Bulk invitation feature coming soon.</p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
