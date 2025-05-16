"use client"

import type React from "react"

import { useState } from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useOnboardingState } from "./onboarding-context"

export function BasicInfoStep() {
  const { state, updateState } = useOnboardingState()
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateField = (name: string, value: any) => {
    let error = ""

    switch (name) {
      case "firstName":
      case "lastName":
        if (!value) error = "This field is required"
        break
      case "email":
        if (!value) {
          error = "Email is required"
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          error = "Please enter a valid email"
        }
        break
      case "phone":
        if (!value) {
          error = "Phone number is required"
        } else if (!/^$$\d{3}$$ \d{3}-\d{4}$/.test(value)) {
          error = "Please enter a valid phone number: (123) 456-7890"
        }
        break
      case "dateOfBirth":
        if (!value) error = "Date of birth is required"
        break
      case "gender":
        if (!value) error = "Please select a gender"
        break
    }

    setErrors((prev) => ({ ...prev, [name]: error }))
    return !error
  }

  const handleChange = (name: string, value: any) => {
    updateState({ [name]: value })
    validateField(name, value)
  }

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, "")

    // Format as (XXX) XXX-XXXX
    if (digits.length <= 3) {
      return digits
    } else if (digits.length <= 6) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
    } else {
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`
    }
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatPhoneNumber(e.target.value)
    updateState({ phone: formattedValue })
    validateField("phone", formattedValue)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Basic Information</h2>
        <p className="text-sm text-muted-foreground">Please provide your personal information.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            value={state.firstName}
            onChange={(e) => handleChange("firstName", e.target.value)}
            placeholder="Enter your first name"
            className={errors.firstName ? "border-red-500" : ""}
          />
          {errors.firstName && <p className="text-sm text-red-500">{errors.firstName}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            value={state.lastName}
            onChange={(e) => handleChange("lastName", e.target.value)}
            placeholder="Enter your last name"
            className={errors.lastName ? "border-red-500" : ""}
          />
          {errors.lastName && <p className="text-sm text-red-500">{errors.lastName}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={state.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="doctor@example.com"
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            value={state.phone}
            onChange={handlePhoneChange}
            placeholder="(123) 456-7890"
            className={errors.phone ? "border-red-500" : ""}
          />
          {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">Date of Birth</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !state.dateOfBirth && "text-muted-foreground",
                  errors.dateOfBirth && "border-red-500",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {state.dateOfBirth ? format(state.dateOfBirth, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={state.dateOfBirth || undefined}
                onSelect={(date) => handleChange("dateOfBirth", date)}
                disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {errors.dateOfBirth && <p className="text-sm text-red-500">{errors.dateOfBirth}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="gender">Gender</Label>
          <Select value={state.gender} onValueChange={(value) => handleChange("gender", value)}>
            <SelectTrigger className={errors.gender ? "border-red-500" : ""}>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="non-binary">Non-binary</SelectItem>
              <SelectItem value="other">Other</SelectItem>
              <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
            </SelectContent>
          </Select>
          {errors.gender && <p className="text-sm text-red-500">{errors.gender}</p>}
        </div>
      </div>
    </div>
  )
}
