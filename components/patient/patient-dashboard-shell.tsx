import type React from "react"
import { cn } from "@/lib/utils"

interface PatientDashboardShellProps extends React.HTMLAttributes<HTMLDivElement> {}

export function PatientDashboardShell({ children, className, ...props }: PatientDashboardShellProps) {
  return (
    <div className={cn("grid items-start gap-8", className)} {...props}>
      {children}
    </div>
  )
}
