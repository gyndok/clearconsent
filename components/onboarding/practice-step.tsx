"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useOnboardingState } from "./onboarding-context"

// List of US states for the practice state dropdown
const usStates = [
  { value: "AL", label: "Alabama" },
  { value: "AK", label: "Alaska" },
  { value: "AZ", label: "Arizona" },
  { value: "AR", label: "Arkansas" },
  { value: "CA", label: "California" },
  { value: "CO", label: "Colorado" },
  { value: "CT", label: "Connecticut" },
  { value: "DE", label: "Delaware" },
  { value: "FL", label: "Florida" },
  { value: "GA", label: "Georgia" },
  { value: "HI", label: "Hawaii" },
  { value: "ID", label: "Idaho" },
  { value: "IL", label: "Illinois" },
  { value: "IN", label: "Indiana" },
  { value: "IA", label: "Iowa" },
  { value: "KS", label: "Kansas" },
  { value: "KY", label: "Kentucky" },
  { value: "LA", label: "Louisiana" },
  { value: "ME", label: "Maine" },
  { value: "MD", label: "Maryland" },
  { value: "MA", label: "Massachusetts" },
  { value: "MI", label: "Michigan" },
  { value: "MN", label: "Minnesota" },
  { value: "MS", label: "Mississippi" },
  { value: "MO", label: "Missouri" },
  { value: "MT", label: "Montana" },
  { value: "NE", label: "Nebraska" },
  { value: "NV", label: "Nevada" },
  { value: "NH", label: "New Hampshire" },
  { value: "NJ", label: "New Jersey" },
  { value: "NM", label: "New Mexico" },
  { value: "NY", label: "New York" },
  { value: "NC", label: "North Carolina" },
  { value: "ND", label: "North Dakota" },
  { value: "OH", label: "Ohio" },
  { value: "OK", label: "Oklahoma" },
  { value: "OR", label: "Oregon" },
  { value: "PA", label: "Pennsylvania" },
  { value: "RI", label: "Rhode Island" },
  { value: "SC", label: "South Carolina" },
  { value: "SD", label: "South Dakota" },
  { value: "TN", label: "Tennessee" },
  { value: "TX", label: "Texas" },
  { value: "UT", label: "Utah" },
  { value: "VT", label: "Vermont" },
  { value: "VA", label: "Virginia" },
  { value: "WA", label: "Washington" },
  { value: "WV", label: "West Virginia" },
  { value: "WI", label: "Wisconsin" },
  { value: "WY", label: "Wyoming" },
  { value: "DC", label: "District of Columbia" },
]

// Practice types
const practiceTypes = [
  "Solo Practice",
  "Group Practice",
  "Hospital",
  "Academic Medical Center",
  "Community Health Center",
  "Urgent Care",
  "Telehealth",
  "Concierge Medicine",
  "Other",
]

export function PracticeStep() {
  const { state, updateState } = useOnboardingState()
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateField = (name: string, value: any) => {
    let error = ""

    switch (name) {
      case "practiceName":
        if (!value) error = "Practice name is required"
        break
      case "practiceType":
        if (!value) error = "Practice type is required"
        break
      case "practiceAddress":
        if (!value) error = "Practice address is required"
        break
      case "practiceCity":
        if (!value) error = "City is required"
        break
      case "practiceState":
        if (!value) error = "State is required"
        break
      case "practiceZip":
        if (!value) {
          error = "ZIP code is required"
        } else if (!/^\d{5}(-\d{4})?$/.test(value)) {
          error = "Please enter a valid ZIP code"
        }
        break
      case "practicePhone":
        if (!value) {
          error = "Phone number is required"
        } else if (!/^$$\d{3}$$ \d{3}-\d{4}$/.test(value)) {
          error = "Please enter a valid phone number: (123) 456-7890"
        }
        break
      case "practiceWebsite":
        if (value && !/^(https?:\/\/)?(www\.)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/\S*)?$/.test(value)) {
          error = "Please enter a valid website URL"
        }
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
    updateState({ practicePhone: formattedValue })
    validateField("practicePhone", formattedValue)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Practice Information</h2>
        <p className="text-sm text-muted-foreground">Please provide details about your medical practice.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="practiceName">Practice Name</Label>
          <Input
            id="practiceName"
            value={state.practiceName}
            onChange={(e) => handleChange("practiceName", e.target.value)}
            placeholder="Enter practice name"
            className={errors.practiceName ? "border-red-500" : ""}
          />
          {errors.practiceName && <p className="text-sm text-red-500">{errors.practiceName}</p>}
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="practiceType">Practice Type</Label>
          <Select value={state.practiceType} onValueChange={(value) => handleChange("practiceType", value)}>
            <SelectTrigger className={errors.practiceType ? "border-red-500" : ""}>
              <SelectValue placeholder="Select practice type" />
            </SelectTrigger>
            <SelectContent>
              {practiceTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.practiceType && <p className="text-sm text-red-500">{errors.practiceType}</p>}
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="practiceAddress">Street Address</Label>
          <Input
            id="practiceAddress"
            value={state.practiceAddress}
            onChange={(e) => handleChange("practiceAddress", e.target.value)}
            placeholder="Enter street address"
            className={errors.practiceAddress ? "border-red-500" : ""}
          />
          {errors.practiceAddress && <p className="text-sm text-red-500">{errors.practiceAddress}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="practiceCity">City</Label>
          <Input
            id="practiceCity"
            value={state.practiceCity}
            onChange={(e) => handleChange("practiceCity", e.target.value)}
            placeholder="Enter city"
            className={errors.practiceCity ? "border-red-500" : ""}
          />
          {errors.practiceCity && <p className="text-sm text-red-500">{errors.practiceCity}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="practiceState">State</Label>
            <Select value={state.practiceState} onValueChange={(value) => handleChange("practiceState", value)}>
              <SelectTrigger className={errors.practiceState ? "border-red-500" : ""}>
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                {usStates.map((state) => (
                  <SelectItem key={state.value} value={state.value}>
                    {state.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.practiceState && <p className="text-sm text-red-500">{errors.practiceState}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="practiceZip">ZIP Code</Label>
            <Input
              id="practiceZip"
              value={state.practiceZip}
              onChange={(e) => handleChange("practiceZip", e.target.value)}
              placeholder="Enter ZIP code"
              className={errors.practiceZip ? "border-red-500" : ""}
            />
            {errors.practiceZip && <p className="text-sm text-red-500">{errors.practiceZip}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="practicePhone">Practice Phone</Label>
          <Input
            id="practicePhone"
            value={state.practicePhone}
            onChange={handlePhoneChange}
            placeholder="(123) 456-7890"
            className={errors.practicePhone ? "border-red-500" : ""}
          />
          {errors.practicePhone && <p className="text-sm text-red-500">{errors.practicePhone}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="practiceWebsite">Practice Website (Optional)</Label>
          <Input
            id="practiceWebsite"
            value={state.practiceWebsite}
            onChange={(e) => handleChange("practiceWebsite", e.target.value)}
            placeholder="https://www.example.com"
            className={errors.practiceWebsite ? "border-red-500" : ""}
          />
          {errors.practiceWebsite && <p className="text-sm text-red-500">{errors.practiceWebsite}</p>}
        </div>
      </div>
    </div>
  )
}
