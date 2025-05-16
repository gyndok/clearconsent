"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import { CheckIcon } from "lucide-react"

interface StepProps {
  title: string
  description?: string
  isActive?: boolean
  isCompleted?: boolean
  onClick?: () => void
  className?: string
}

export function Step({ title, description, isActive, isCompleted, onClick, className }: StepProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-2 cursor-pointer",
        isActive && "text-primary",
        !isActive && !isCompleted && "text-muted-foreground",
        className,
      )}
      onClick={onClick}
    >
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-center text-sm font-medium",
          isActive && "border-primary bg-primary text-primary-foreground",
          isCompleted && "border-primary bg-primary text-primary-foreground",
          !isActive && !isCompleted && "border-muted-foreground",
        )}
      >
        {isCompleted ? <CheckIcon className="h-4 w-4" /> : <span>{title.charAt(0)}</span>}
      </div>
      <div className="flex flex-col">
        <div className="text-sm font-medium">{title}</div>
        {description && <div className="text-xs text-muted-foreground">{description}</div>}
      </div>
    </div>
  )
}

interface StepperProps {
  steps: { title: string; description?: string }[]
  activeStep: number
  onStepClick?: (index: number) => void
  className?: string
}

export function Stepper({ steps, activeStep, onStepClick, className }: StepperProps) {
  return (
    <div className={cn("flex flex-col gap-2 sm:flex-row sm:gap-6", className)}>
      {steps.map((step, index) => (
        <div key={index} className="flex items-start gap-4">
          <Step
            title={step.title}
            description={step.description}
            isActive={index === activeStep}
            isCompleted={index < activeStep}
            onClick={() => onStepClick?.(index)}
          />
          {index < steps.length - 1 && (
            <div className="hidden h-8 border-t border-dashed border-muted-foreground sm:block flex-1 self-center" />
          )}
        </div>
      ))}
    </div>
  )
}

export const StepLabel = ({ children }: { children: React.ReactNode }) => {
  return <div className="text-sm font-medium">{children}</div>
}

export const StepDescription = ({ children }: { children: React.ReactNode }) => {
  return <div className="text-xs text-muted-foreground">{children}</div>
}
