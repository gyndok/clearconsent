"use client"

import { useState } from "react"
import type { UseFormReturn } from "react-hook-form"
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription, Form } from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"
import { Search, FileText, Video } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Switch } from "@/components/ui/switch"

// Mock data for procedures
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

interface AssignProceduresFormProps {
  form: UseFormReturn<any>
  isEditing?: boolean
}

export function AssignProceduresForm({ form, isEditing = false }: AssignProceduresFormProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredProcedures = procedures.filter(
    (procedure) =>
      procedure.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      procedure.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <Form {...form}>
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">{isEditing ? "Manage Assigned Procedures" : "Assign Procedures"}</h2>

        <div className="flex items-center gap-2 mb-4">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search procedures..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9"
          />
        </div>

        <FormField
          control={form.control}
          name="assignedProcedures"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel>Select procedures to assign</FormLabel>
                <FormDescription>
                  {isEditing
                    ? "Update the procedures assigned to this patient."
                    : "Choose one or more procedures to assign to this patient."}
                </FormDescription>
              </div>

              <ScrollArea className="h-[300px] border rounded-md p-4">
                {filteredProcedures.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">No procedures found.</div>
                ) : (
                  <div className="space-y-4">
                    {filteredProcedures.map((procedure) => (
                      <FormField
                        key={procedure.id}
                        control={form.control}
                        name="assignedProcedures"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={procedure.id}
                              className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(procedure.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, procedure.id])
                                      : field.onChange(field.value?.filter((value: string) => value !== procedure.id))
                                  }}
                                />
                              </FormControl>
                              <div className="flex-1 space-y-1 leading-none">
                                <div className="flex items-center">
                                  <FormLabel className="font-medium cursor-pointer">{procedure.title}</FormLabel>
                                  <div className="flex ml-2 space-x-1">
                                    {procedure.hasPDF && <FileText className="h-4 w-4 text-muted-foreground" />}
                                    {procedure.hasVideo && <Video className="h-4 w-4 text-muted-foreground" />}
                                  </div>
                                </div>
                                <FormDescription>{procedure.description}</FormDescription>
                              </div>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                  </div>
                )}
              </ScrollArea>
              <FormMessage />
            </FormItem>
          )}
        />

        {isEditing ? (
          <div className="space-y-4 mt-6 border-t pt-6">
            <FormField
              control={form.control}
              name="sendNotification"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Send Update Notification</FormLabel>
                    <FormDescription>
                      Send a notification to the patient about changes to their assigned procedures.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            {form.watch("sendNotification") && (
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
            )}
          </div>
        ) : (
          <div className="space-y-4 mt-6 border-t pt-6">
            <FormField
              control={form.control}
              name="sendInvitation"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Send Invitation</FormLabel>
                    <FormDescription>Send an invitation to the patient to complete the consent forms.</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            {form.watch("sendInvitation") && (
              <FormField
                control={form.control}
                name="invitationMethod"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Invitation Method</FormLabel>
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
            )}
          </div>
        )}
      </div>
    </Form>
  )
}
