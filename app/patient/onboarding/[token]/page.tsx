import type { Metadata } from "next"
import { PatientOnboardingForm } from "@/components/patient/patient-onboarding-form"

export const metadata: Metadata = {
  title: "Patient Onboarding | ClearConsent",
  description: "Complete your registration to access your ClearConsent account",
}

interface PatientOnboardingPageProps {
  params: {
    token: string
  }
}

export default function PatientOnboardingPage({ params }: PatientOnboardingPageProps) {
  return (
    <div className="container max-w-4xl py-10">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">Welcome to ClearConsent</h1>
        <p className="mt-2 text-muted-foreground">
          Complete your registration to access your personalized patient portal
        </p>
      </div>
      <PatientOnboardingForm token={params.token} />
    </div>
  )
}
