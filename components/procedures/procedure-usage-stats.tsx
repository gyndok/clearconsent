"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Clock, Eye, Send } from "lucide-react"

interface ProcedureUsageStatsProps {
  procedure: any
}

export function ProcedureUsageStats({ procedure }: ProcedureUsageStatsProps) {
  // Calculate completion rate
  const completionRate =
    procedure.assignedCount > 0 ? Math.round((procedure.completedCount / procedure.assignedCount) * 100) : 0

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assigned</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{procedure.assignedCount}</div>
            <p className="text-xs text-muted-foreground">Total patient assignments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{procedure.completedCount}</div>
            <p className="text-xs text-muted-foreground">Patients who completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{procedure.inProgressCount}</div>
            <p className="text-xs text-muted-foreground">Patients currently reviewing</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Viewed</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{procedure.viewedCount}</div>
            <p className="text-xs text-muted-foreground">Patients who viewed only</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Completion Rate</CardTitle>
          <CardDescription>Percentage of patients who completed the consent process for this procedure</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold">{completionRate}%</div>
                <div className="text-sm text-muted-foreground">
                  ({procedure.completedCount} of {procedure.assignedCount})
                </div>
              </div>
              <div className="text-sm text-muted-foreground">Target: 80%</div>
            </div>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full ${
                  completionRate >= 80 ? "bg-green-500" : completionRate >= 50 ? "bg-yellow-500" : "bg-red-500"
                }`}
                style={{ width: `${completionRate}%` }}
              ></div>
            </div>
            <div className="text-sm text-muted-foreground">
              {completionRate >= 80
                ? "Excellent completion rate! Your patients are engaging well with this procedure."
                : completionRate >= 50
                  ? "Good completion rate. Consider reviewing the content to improve engagement."
                  : "Low completion rate. We recommend reviewing and simplifying the content."}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Average Completion Time</CardTitle>
          <CardDescription>How long it takes patients to complete the consent process</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold">12 minutes</div>
              </div>
              <div className="text-sm text-muted-foreground">Expected: {procedure.estimatedDuration} minutes</div>
            </div>
            <div className="text-sm text-muted-foreground">
              {procedure.estimatedDuration > 12
                ? "Patients are completing this procedure faster than expected."
                : procedure.estimatedDuration === 12
                  ? "Patients are completing this procedure in the expected time."
                  : "Patients are taking longer than expected to complete this procedure."}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
