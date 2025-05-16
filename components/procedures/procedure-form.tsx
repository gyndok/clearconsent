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
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/hooks/use-toast"
import { Icons } from "@/components/icons"
import { FileUploader } from "@/components/procedures/file-uploader"
import { VideoPreview } from "@/components/procedures/video-preview"

// Mock data for procedure categories
const procedureCategories = [
  "Orthopedic",
  "Cardiology",
  "Gastroenterology",
  "Neurology",
  "Ophthalmology",
  "Dental",
  "ENT",
  "General Surgery",
  "Gynecology",
  "Plastic Surgery",
  "Urology",
  "Dermatology",
]

// Define the form schema
const formSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  category: z.string().min(1, "Please select a category."),
  estimatedDuration: z.coerce.number().min(1, "Duration must be at least 1 minute."),
  hasPDF: z.boolean().default(false),
  pdfUrl: z.string().url("Please enter a valid URL.").optional().or(z.literal("")),
  hasVideo: z.boolean().default(false),
  videoUrl: z.string().url("Please enter a valid URL.").optional().or(z.literal("")),
})

type FormValues = z.infer<typeof formSchema>

interface ProcedureFormProps {
  procedure?: any
  isEditing?: boolean
}

export function ProcedureForm({ procedure, isEditing = false }: ProcedureFormProps) {
  const [activeTab, setActiveTab] = useState("info")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const router = useRouter()

  // Initialize the form with procedure data if editing
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: procedure?.title || "",
      description: procedure?.description || "",
      category: procedure?.category || "",
      estimatedDuration: procedure?.estimatedDuration || 15,
      hasPDF: procedure?.hasPDF || false,
      pdfUrl: procedure?.pdfUrl || "",
      hasVideo: procedure?.hasVideo || false,
      videoUrl: procedure?.videoUrl || "",
    },
  })

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true)

    try {
      // In a real app, this would be an API call to create/update the procedure
      console.log("Submitting procedure data:", data)
      console.log("PDF File:", pdfFile)
      console.log("Video File:", videoFile)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Show success message
      toast({
        title: isEditing ? "Procedure updated successfully" : "Procedure created successfully",
        description: `"${data.title}" has been ${isEditing ? "updated" : "created"}.`,
      })

      // Redirect to procedures list
      router.push("/procedures")
    } catch (error) {
      console.error("Error submitting procedure:", error)
      toast({
        title: `Error ${isEditing ? "updating" : "creating"} procedure`,
        description: `There was an error ${isEditing ? "updating" : "creating"} the procedure. Please try again.`,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleTabChange = (value: string) => {
    // Only allow proceeding to materials if basic info is valid
    if (value === "materials" && activeTab === "info") {
      const isValid = form.trigger(["title", "description", "category", "estimatedDuration"])
      if (!isValid) {
        return
      }
    }

    setActiveTab(value)
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="info">Basic Information</TabsTrigger>
              <TabsTrigger value="materials">Materials & Media</TabsTrigger>
            </TabsList>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <TabsContent value="info" className="py-4 space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Procedure Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter procedure title" {...field} />
                        </FormControl>
                        <FormDescription>The name of the procedure as it will appear to patients.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter a detailed description of the procedure"
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>A clear explanation of what the procedure involves.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {procedureCategories.map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>The medical specialty this procedure belongs to.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="estimatedDuration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Estimated Duration (minutes)</FormLabel>
                          <FormControl>
                            <Input type="number" min={1} {...field} />
                          </FormControl>
                          <FormDescription>
                            How long it typically takes to review and consent to this procedure.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-between mt-6">
                    <Button variant="outline" onClick={() => router.back()}>
                      Cancel
                    </Button>
                    <Button type="button" onClick={() => handleTabChange("materials")}>
                      Continue to Materials
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="materials" className="py-4 space-y-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium">Procedure Materials</h3>
                      <p className="text-sm text-muted-foreground">
                        Add educational materials to help patients understand the procedure.
                      </p>
                    </div>

                    <div className="space-y-6 border-t pt-6">
                      <FormField
                        control={form.control}
                        name="hasPDF"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">PDF Document</FormLabel>
                              <FormDescription>
                                Include a PDF document with detailed information about the procedure.
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      {form.watch("hasPDF") && (
                        <div className="ml-6 space-y-4">
                          <FormField
                            control={form.control}
                            name="pdfUrl"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>PDF URL</FormLabel>
                                <FormControl>
                                  <Input placeholder="https://example.com/document.pdf" {...field} />
                                </FormControl>
                                <FormDescription>
                                  Enter a URL to an existing PDF or upload a new one below.
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="space-y-2">
                            <label className="text-sm font-medium">Upload PDF</label>
                            <FileUploader accept=".pdf" maxSize={10} onFileChange={(file) => setPdfFile(file)} />
                            <p className="text-sm text-muted-foreground">Upload a PDF document (max 10MB).</p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-6 border-t pt-6">
                      <FormField
                        control={form.control}
                        name="hasVideo"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Video Explanation</FormLabel>
                              <FormDescription>Include a video explaining the procedure to patients.</FormDescription>
                            </div>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      {form.watch("hasVideo") && (
                        <div className="ml-6 space-y-4">
                          <FormField
                            control={form.control}
                            name="videoUrl"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Video URL</FormLabel>
                                <FormControl>
                                  <Input placeholder="https://example.com/video.mp4" {...field} />
                                </FormControl>
                                <FormDescription>
                                  Enter a URL to an existing video or upload a new one below.
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {form.watch("videoUrl") && (
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Video Preview</label>
                              <VideoPreview url={form.watch("videoUrl")} />
                            </div>
                          )}

                          <div className="space-y-2">
                            <label className="text-sm font-medium">Upload Video</label>
                            <FileUploader accept="video/*" maxSize={100} onFileChange={(file) => setVideoFile(file)} />
                            <p className="text-sm text-muted-foreground">
                              Upload a video file (max 100MB) or{" "}
                              <Button
                                type="button"
                                variant="link"
                                className="p-0 h-auto"
                                onClick={() => router.push(`/procedures/${procedure?.id || "new"}/record-video`)}
                              >
                                record a new video
                              </Button>
                              .
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between mt-6">
                      <Button variant="outline" onClick={() => handleTabChange("info")}>
                        Back to Information
                      </Button>
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? (
                          <>
                            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                            {isEditing ? "Updating..." : "Creating..."}
                          </>
                        ) : isEditing ? (
                          "Update Procedure"
                        ) : (
                          "Create Procedure"
                        )}
                      </Button>
                    </div>
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
