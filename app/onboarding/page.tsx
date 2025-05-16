"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Stepper } from "@/components/ui/stepper"
import { toast } from "@/hooks/use-toast"
import { BasicInfoStep } from "@/components/onboarding/basic-info-step"
import { CredentialsStep } from "@/components/onboarding/credentials-step"
import { PracticeStep } from "@/components/onboarding/practice-step"
import { AccountSetupStep } from "@/components/onboarding/account-setup-step"
import { SummaryStep } from "@/components/onboarding/summary-step"
import { OnboardingProvider, useOnboardingState } from "@/components/onboarding/onboarding-context"
import { Icons } from "@/components/icons"

function OnboardingWizard() {
  const [step, setStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { state, isStepValid } = useOnboardingState()
  const router = useRouter()

  const steps = [
    { title: "Basic Info", description: "Personal information" },
    { title: "Credentials", description: "Professional credentials" },
    { title: "Practice", description: "Practice details" },
    { title: "Account Setup", description: "Preferences and settings" },
    { title: "Summary", description: "Review and confirm" },
  ]

  const nextStep = () => {
    if (isStepValid(step)) {
      setStep((prev) => Math.min(prev + 1, steps.length - 1))
      window.scrollTo(0, 0)
    } else {
      toast({
        title: "Please complete all required fields",
        description: "Some required information is missing or invalid.",
        variant: "destructive",
      })
    }
  }

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 0))
    window.scrollTo(0, 0)
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      // In a real app, this would be an API call to save all the onboarding data
      console.log("Submitting onboarding data:", state)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Show success message
      toast({
        title: "Onboarding complete",
        description: "Your account has been set up successfully.",
      })

      // Redirect to dashboard
      router.push("/dashboard")
    } catch (error) {
      console.error("Onboarding submission error:", error)
      toast({
        title: "Submission failed",
        description: "There was an error saving your information. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container max-w-4xl py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Complete Your Profile</h1>
        <p className="text-muted-foreground mt-2">
          Let's set up your doctor profile to get you started with ClearConsent.
        </p>
      </div>

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
          {step === 0 && <BasicInfoStep />}
          {step === 1 && <CredentialsStep />}
          {step === 2 && <PracticeStep />}
          {step === 3 && <AccountSetupStep />}
          {step === 4 && <SummaryStep />}

          <div className="flex justify-between mt-8">
            {step > 0 ? (
              <Button type="button" variant="outline" onClick={prevStep}>
                Previous
              </Button>
            ) : (
              <div></div> // Empty div to maintain layout with flex justify-between
            )}

            {step < steps.length - 1 ? (
              <Button type="button" onClick={nextStep}>
                Next
              </Button>
            ) : (
              <Button type="button" onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" /> Completing Setup...
                  </>
                ) : (
                  "Complete Setup"
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function OnboardingPage() {
  return (
    <OnboardingProvider>
      <OnboardingWizard />
    </OnboardingProvider>
  )
}
