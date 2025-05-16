import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export function WelcomeCard() {
  // Mock data - in a real app, this would come from the backend
  const patientName = "Alex Johnson"
  const completedCount = 2
  const totalCount = 5
  const completionPercentage = (completedCount / totalCount) * 100

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Welcome back, {patientName}</CardTitle>
        <CardDescription>Here's your progress on your assigned procedures</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Completion Progress</span>
            <span className="text-sm font-medium">
              {completedCount} of {totalCount} completed
            </span>
          </div>
          <Progress value={completionPercentage} className="h-2" />
        </div>
      </CardContent>
    </Card>
  )
}
