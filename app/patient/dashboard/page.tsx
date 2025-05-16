import { PatientDashboardHeader } from "@/components/patient/patient-dashboard-header"
import { PatientDashboardShell } from "@/components/patient/patient-dashboard-shell"
import { AssignmentsList } from "@/components/patient/assignments-list"
import { WelcomeCard } from "@/components/patient/welcome-card"

export default function PatientDashboardPage() {
  return (
    <PatientDashboardShell>
      <PatientDashboardHeader heading="My Dashboard" text="View and complete your assigned procedures." />
      <WelcomeCard />
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">My Assigned Procedures</h2>
        <AssignmentsList />
      </div>
    </PatientDashboardShell>
  )
}
