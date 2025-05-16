import type { Metadata } from "next"
import { PatientInviteForm } from "@/components/patients/patient-invite-form"

export const metadata: Metadata = {
  title: "Invite Patient | ClearConsent",
  description: "Invite a new patient to ClearConsent",
}

export default function InvitePatientPage() {
  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Invite a Patient</h1>
        <p className="mt-2 text-muted-foreground">Generate an invitation link or QR code to send to your patient</p>
      </div>
      <PatientInviteForm />
    </div>
  )
}
