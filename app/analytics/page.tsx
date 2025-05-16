import type { Metadata } from "next"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { AnalyticsOverview } from "@/components/analytics/analytics-overview"
import { PatientAnalytics } from "@/components/analytics/patient-analytics"
import { ProcedureAnalytics } from "@/components/analytics/procedure-analytics"
import { ConsentAnalytics } from "@/components/analytics/consent-analytics"

export const metadata: Metadata = {
  title: "Analytics | ClearConsent",
  description: "View analytics and insights about your patients and procedures.",
}

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Analytics</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          View insights and statistics about your patients, procedures, and consent rates.
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="patients">Patients</TabsTrigger>
          <TabsTrigger value="procedures">Procedures</TabsTrigger>
          <TabsTrigger value="consent">Consent</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <AnalyticsOverview />
        </TabsContent>
        <TabsContent value="patients" className="space-y-4">
          <PatientAnalytics />
        </TabsContent>
        <TabsContent value="procedures" className="space-y-4">
          <ProcedureAnalytics />
        </TabsContent>
        <TabsContent value="consent" className="space-y-4">
          <ConsentAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  )
}
