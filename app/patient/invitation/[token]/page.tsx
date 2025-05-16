import type { Metadata } from "next"
import { InvitationLanding } from "@/components/patient/invitation-landing"

export const metadata: Metadata = {
  title: "Patient Invitation | ClearConsent",
  description: "Accept your invitation to ClearConsent",
}

interface InvitationPageProps {
  params: {
    token: string
  }
}

export default function InvitationPage({ params }: InvitationPageProps) {
  return <InvitationLanding token={params.token} />
}
