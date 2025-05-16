"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Stepper, Step, StepDescription, StepLabel } from "@/components/ui/stepper"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

const personalInfoSchema = z.object({
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: "Please enter a valid date in YYYY-MM-DD format.",
  }),
  gender: z.enum(["male", "female", "other", "prefer-not-to-say"], {
    required_error: "Please select a gender.",
  }),
})

const contactInfoSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(10, {
    message: "Phone number must be at least 10 digits.",
  }),
  address: z.string().min(5, {
    message: "Address must be at least 5 characters.",
  }),
  city: z.string().min(2, {
    message: "City must be at least 2 characters.",
  }),
  state: z.string().min(2, {
    message: "State must be at least 2 characters.",
  }),
  zipCode: z.string().min(5, {
    message: "Zip code must be at least 5 characters.",
  }),
})

const accountSetupSchema = z
  .object({
    password: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
    confirmPassword: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
    preferredLanguage: z.string({
      required_error: "Please select a preferred language.",
    }),
    communicationPreference: z.enum(["email", "phone", "both"], {
      required_error: "Please select a communication preference.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  })

const formSchema = z.object({
  personalInfo: personalInfoSchema,
  contactInfo: contactInfoSchema,
  accountSetup: accountSetupSchema,
})

type FormData = z.infer<typeof formSchema>

interface PatientOnboardingFormProps {
  token: string
}

export function PatientOnboardingForm({ token }: PatientOnboardingFormProps) {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      personalInfo: {
        firstName: "",
        lastName: "",
        dateOfBirth: "",
        gender: "prefer-not-to-say",
      },
      contactInfo: {
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
      },
      accountSetup: {
        password: "",
        confirmPassword: "",
        preferredLanguage: "english",
        communicationPreference: "email",
      },
    },
    mode: "onChange",
  })

  const steps = [
    {
      label: "Personal Information",
      description: "Basic personal details",
      fields: ["personalInfo.firstName", "personalInfo.lastName", "personalInfo.dateOfBirth", "personalInfo.gender"],
    },
    {
      label: "Contact Information",
      description: "How we can reach you",
      fields: [
        "contactInfo.email",
        "contactInfo.phone",
        "contactInfo.address",
        "contactInfo.city",
        "contactInfo.state",
        "contactInfo.zipCode",
      ],
    },
    {
      label: "Account Setup",
      description: "Create your account",
      fields: [
        "accountSetup.password",
        "accountSetup.confirmPassword",
        "accountSetup.preferredLanguage",
        "accountSetup.communicationPreference",
      ],
    },
    {
      label: "Review & Confirm",
      description: "Verify your information",
      fields: [],
    },
  ]

  const nextStep = async () => {
    const fields = steps[step].fields
    const isValid = await form.trigger(fields as any)

    if (isValid) {
      setStep((prev) => Math.min(prev + 1, steps.length - 1))
    }
  }

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 0))
  }

  async function onSubmit(values: FormData) {
    setIsLoading(true)

    try {
      // In a real app, we would call an API to register the user
      console.log(values)
      console.log("Token:", token)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Registration successful",
        description: "Your account has been created successfully.",
      })

      // Redirect to patient dashboard
      router.push("/patient/dashboard")
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "There was an error creating your account. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Patient Registration</CardTitle>
        <CardDescription>Complete all steps to create your account</CardDescription>
      </CardHeader>
      <CardContent>
        <Stepper value={step} className="mb-8">
          {steps.map((s, i) => (
            <Step key={i} onClick={() => i < step && setStep(i)}>
              <StepLabel>{s.label}</StepLabel>
              <StepDescription>{s.description}</StepDescription>
            </Step>
          ))}
        </Stepper>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {step === 0 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="personalInfo.firstName"
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
                    name="personalInfo.lastName"
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
                <FormField
                  control={form.control}
                  name="personalInfo.dateOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Birth</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormDescription>Please enter your date of birth in YYYY-MM-DD format.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="personalInfo.gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="male" />
                            </FormControl>
                            <FormLabel className="font-normal">Male</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="female" />
                            </FormControl>
                            <FormLabel className="font-normal">Female</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="other" />
                            </FormControl>
                            <FormLabel className="font-normal">Other</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="prefer-not-to-say" />
                            </FormControl>
                            <FormLabel className="font-normal">Prefer not to say</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="contactInfo.email"
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
                    name="contactInfo.phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
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
                  name="contactInfo.address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input placeholder="123 Main St" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="contactInfo.city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="Anytown" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="contactInfo.state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State</FormLabel>
                        <FormControl>
                          <Input placeholder="CA" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="contactInfo.zipCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Zip Code</FormLabel>
                        <FormControl>
                          <Input placeholder="12345" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="accountSetup.password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormDescription>Password must be at least 8 characters long.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="accountSetup.confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="accountSetup.preferredLanguage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred Language</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a language" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="english">English</SelectItem>
                          <SelectItem value="spanish">Spanish</SelectItem>
                          <SelectItem value="french">French</SelectItem>
                          <SelectItem value="german">German</SelectItem>
                          <SelectItem value="chinese">Chinese</SelectItem>
                          <SelectItem value="japanese">Japanese</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="accountSetup.communicationPreference"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Communication Preference</FormLabel>
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
                              <RadioGroupItem value="phone" />
                            </FormControl>
                            <FormLabel className="font-normal">Phone</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="both" />
                            </FormControl>
                            <FormLabel className="font-normal">Both</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="rounded-md border p-4">
                  <h3 className="text-lg font-medium">Personal Information</h3>
                  <dl className="mt-2 divide-y divide-gray-200">
                    <div className="grid grid-cols-3 gap-4 py-3">
                      <dt className="text-sm font-medium text-gray-500">Name</dt>
                      <dd className="col-span-2 text-sm">
                        {form.getValues("personalInfo.firstName")} {form.getValues("personalInfo.lastName")}
                      </dd>
                    </div>
                    <div className="grid grid-cols-3 gap-4 py-3">
                      <dt className="text-sm font-medium text-gray-500">Date of Birth</dt>
                      <dd className="col-span-2 text-sm">{form.getValues("personalInfo.dateOfBirth")}</dd>
                    </div>
                    <div className="grid grid-cols-3 gap-4 py-3">
                      <dt className="text-sm font-medium text-gray-500">Gender</dt>
                      <dd className="col-span-2 text-sm capitalize">
                        {form.getValues("personalInfo.gender").replace("-", " ")}
                      </dd>
                    </div>
                  </dl>
                </div>

                <div className="rounded-md border p-4">
                  <h3 className="text-lg font-medium">Contact Information</h3>
                  <dl className="mt-2 divide-y divide-gray-200">
                    <div className="grid grid-cols-3 gap-4 py-3">
                      <dt className="text-sm font-medium text-gray-500">Email</dt>
                      <dd className="col-span-2 text-sm">{form.getValues("contactInfo.email")}</dd>
                    </div>
                    <div className="grid grid-cols-3 gap-4 py-3">
                      <dt className="text-sm font-medium text-gray-500">Phone</dt>
                      <dd className="col-span-2 text-sm">{form.getValues("contactInfo.phone")}</dd>
                    </div>
                    <div className="grid grid-cols-3 gap-4 py-3">
                      <dt className="text-sm font-medium text-gray-500">Address</dt>
                      <dd className="col-span-2 text-sm">
                        {form.getValues("contactInfo.address")}, {form.getValues("contactInfo.city")},{" "}
                        {form.getValues("contactInfo.state")} {form.getValues("contactInfo.zipCode")}
                      </dd>
                    </div>
                  </dl>
                </div>

                <div className="rounded-md border p-4">
                  <h3 className="text-lg font-medium">Account Preferences</h3>
                  <dl className="mt-2 divide-y divide-gray-200">
                    <div className="grid grid-cols-3 gap-4 py-3">
                      <dt className="text-sm font-medium text-gray-500">Preferred Language</dt>
                      <dd className="col-span-2 text-sm capitalize">
                        {form.getValues("accountSetup.preferredLanguage")}
                      </dd>
                    </div>
                    <div className="grid grid-cols-3 gap-4 py-3">
                      <dt className="text-sm font-medium text-gray-500">Communication Preference</dt>
                      <dd className="col-span-2 text-sm capitalize">
                        {form.getValues("accountSetup.communicationPreference")}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            )}
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={prevStep} disabled={step === 0}>
          Previous
        </Button>
        {step < steps.length - 1 ? (
          <Button onClick={nextStep}>Next</Button>
        ) : (
          <Button onClick={form.handleSubmit(onSubmit)} disabled={isLoading}>
            {isLoading ? (
              <>
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              "Complete Registration"
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
