"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"

interface InvitationLandingProps {
  token: string
}

export function InvitationLanding({ token }: InvitationLandingProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [invitationDetails, setInvitationDetails] = useState({
    doctorName: "Dr. Sarah Johnson",
    practiceName: "Wellness Medical Center",
    procedureName: "Knee Arthroscopy",
    patientEmail: "patient@example.com",
  })

  // In a real app, we would fetch the invitation details using the token
  // For now, we'll use mock data

  const handleAccept = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Invitation accepted",
        description: "You will now be redirected to complete your registration.",
      })

      // Redirect to onboarding page with token
      router.push(`/patient/onboarding/${token}`)
    } catch (error) {
      toast({
        title: "Error accepting invitation",
        description: "There was a problem accepting your invitation. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDecline = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Invitation declined",
        description: "You have declined the invitation. Please contact your healthcare provider if this was a mistake.",
      })

      // Redirect to home page
      router.push("/")
    } catch (error) {
      toast({
        title: "Error declining invitation",
        description: "There was a problem declining your invitation. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container flex min-h-screen flex-col items-center justify-center">
      <div className="mx-auto max-w-md">
        <div className="mb-8 flex justify-center">
          <div className="flex items-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-8 w-8 text-teal-600"
            >
              <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
            </svg>
            <span className="text-2xl font-bold">ClearConsent</span>
          </div>
        </div>

        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">You've Been Invited</CardTitle>
            <CardDescription>
              {invitationDetails.doctorName} from {invitationDetails.practiceName} has invited you to ClearConsent
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-center">
              <div className="relative h-32 w-32 overflow-hidden rounded-full">
                <Image src="/caring-doctor.png" alt="Doctor" fill className="object-cover" />
              </div>
            </div>

            <div className="rounded-md bg-muted p-4">
              <h3 className="mb-2 font-medium">Invitation Details</h3>
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="text-sm text-muted-foreground">Doctor:</dt>
                  <dd className="text-sm font-medium">{invitationDetails.doctorName}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-muted-foreground">Practice:</dt>
                  <dd className="text-sm font-medium">{invitationDetails.practiceName}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-muted-foreground">Procedure:</dt>
                  <dd className="text-sm font-medium">{invitationDetails.procedureName}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-muted-foreground">Email:</dt>
                  <dd className="text-sm font-medium">{invitationDetails.patientEmail}</dd>
                </div>
              </dl>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              <p>
                ClearConsent helps you understand your medical procedures through interactive content and allows you to
                provide informed consent digitally.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2 sm:flex-row sm:justify-between sm:space-x-2 sm:space-y-0">
            <Button variant="outline" className="w-full sm:w-auto" onClick={handleDecline} disabled={isLoading}>
              Decline
            </Button>
            <Button className="w-full sm:w-auto" onClick={handleAccept} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Accept & Register"
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
