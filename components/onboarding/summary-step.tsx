"use client"

import { format } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useOnboardingState } from "./onboarding-context"

export function SummaryStep() {
  const { state } = useOnboardingState()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Review Your Information</h2>
        <p className="text-sm text-muted-foreground">Please review your information before completing setup.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Name</h3>
              <p>
                {state.firstName} {state.lastName}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
              <p>{state.email}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Phone</h3>
              <p>{state.phone}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Date of Birth</h3>
              <p>{state.dateOfBirth ? format(state.dateOfBirth, "PPP") : "Not provided"}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Gender</h3>
              <p>{state.gender}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Professional Credentials</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Medical License</h3>
              <p>
                {state.medicalLicense} ({state.licenseState})
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">NPI Number</h3>
              <p>{state.npiNumber}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Specialties</h3>
              <div className="flex flex-wrap gap-2 mt-1">
                {state.specialties.map((specialty) => (
                  <Badge key={specialty} variant="secondary">
                    {specialty}
                  </Badge>
                ))}
              </div>
            </div>
            {state.boardCertifications.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Board Certifications</h3>
                <div className="flex flex-wrap gap-2 mt-1">
                  {state.boardCertifications.map((certification) => (
                    <Badge key={certification} variant="secondary">
                      {certification}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Practice Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Practice Name</h3>
              <p>{state.practiceName}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Practice Type</h3>
              <p>{state.practiceType}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Address</h3>
              <p>
                {state.practiceAddress}
                <br />
                {state.practiceCity}, {state.practiceState} {state.practiceZip}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Phone</h3>
              <p>{state.practicePhone}</p>
            </div>
            {state.practiceWebsite && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Website</h3>
                <p>{state.practiceWebsite}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Account Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Languages</h3>
              <div className="flex flex-wrap gap-2 mt-1">
                {state.preferredLanguages.map((language) => (
                  <Badge key={language} variant="secondary">
                    {language}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Notification Preferences</h3>
              <ul className="mt-1 space-y-1">
                {state.notificationPreferences.email && <li>Email Notifications</li>}
                {state.notificationPreferences.sms && <li>SMS Notifications</li>}
                {state.notificationPreferences.push && <li>Push Notifications</li>}
              </ul>
            </div>
            {state.defaultAvailability.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Default Availability</h3>
                <p>{state.defaultAvailability.join(", ")}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="rounded-lg border p-4 bg-muted/50">
        <p className="text-sm">
          By clicking "Complete Setup", you confirm that all the information provided is accurate and complete. You can
          update this information later from your profile settings.
        </p>
      </div>
    </div>
  )
}
