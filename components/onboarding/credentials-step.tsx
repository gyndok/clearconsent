"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Plus } from "lucide-react"
import { useOnboardingState } from "./onboarding-context"

// List of US states for the license state dropdown
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

// Common medical specialties
const commonSpecialties = [
  "Allergy and Immunology",
  "Anesthesiology",
  "Cardiology",
  "Dermatology",
  "Emergency Medicine",
  "Endocrinology",
  "Family Medicine",
  "Gastroenterology",
  "General Surgery",
  "Geriatrics",
  "Hematology",
  "Infectious Disease",
  "Internal Medicine",
  "Nephrology",
  "Neurology",
  "Neurosurgery",
  "Obstetrics and Gynecology",
  "Oncology",
  "Ophthalmology",
  "Orthopedic Surgery",
  "Otolaryngology",
  "Pathology",
  "Pediatrics",
  "Physical Medicine and Rehabilitation",
  "Plastic Surgery",
  "Psychiatry",
  "Pulmonology",
  "Radiology",
  "Rheumatology",
  "Urology",
  "Vascular Surgery",
]

export function CredentialsStep() {
  const { state, updateState } = useOnboardingState()
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [newSpecialty, setNewSpecialty] = useState("")
  const [newCertification, setNewCertification] = useState("")

  const validateField = (name: string, value: any) => {
    let error = ""

    switch (name) {
      case "medicalLicense":
        if (!value) error = "Medical license number is required"
        break
      case "licenseState":
        if (!value) error = "License state is required"
        break
      case "npiNumber":
        if (!value) {
          error = "NPI number is required"
        } else if (!/^\d{10}$/.test(value)) {
          error = "NPI must be a 10-digit number"
        }
        break
      case "specialties":
        if (!value || value.length === 0) error = "At least one specialty is required"
        break
    }

    setErrors((prev) => ({ ...prev, [name]: error }))
    return !error
  }

  const handleChange = (name: string, value: any) => {
    updateState({ [name]: value })
    validateField(name, value)
  }

  const addSpecialty = () => {
    if (newSpecialty && !state.specialties.includes(newSpecialty)) {
      const updatedSpecialties = [...state.specialties, newSpecialty]
      updateState({ specialties: updatedSpecialties })
      validateField("specialties", updatedSpecialties)
      setNewSpecialty("")
    }
  }

  const removeSpecialty = (specialty: string) => {
    const updatedSpecialties = state.specialties.filter((s) => s !== specialty)
    updateState({ specialties: updatedSpecialties })
    validateField("specialties", updatedSpecialties)
  }

  const addCertification = () => {
    if (newCertification && !state.boardCertifications.includes(newCertification)) {
      const updatedCertifications = [...state.boardCertifications, newCertification]
      updateState({ boardCertifications: updatedCertifications })
      setNewCertification("")
    }
  }

  const removeCertification = (certification: string) => {
    const updatedCertifications = state.boardCertifications.filter((c) => c !== certification)
    updateState({ boardCertifications: updatedCertifications })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Professional Credentials</h2>
        <p className="text-sm text-muted-foreground">Please provide your medical credentials.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="medicalLicense">Medical License Number</Label>
          <Input
            id="medicalLicense"
            value={state.medicalLicense}
            onChange={(e) => handleChange("medicalLicense", e.target.value)}
            placeholder="Enter your license number"
            className={errors.medicalLicense ? "border-red-500" : ""}
          />
          {errors.medicalLicense && <p className="text-sm text-red-500">{errors.medicalLicense}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="licenseState">License State</Label>
          <Select value={state.licenseState} onValueChange={(value) => handleChange("licenseState", value)}>
            <SelectTrigger className={errors.licenseState ? "border-red-500" : ""}>
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
          {errors.licenseState && <p className="text-sm text-red-500">{errors.licenseState}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="npiNumber">NPI Number</Label>
          <Input
            id="npiNumber"
            value={state.npiNumber}
            onChange={(e) => handleChange("npiNumber", e.target.value)}
            placeholder="10-digit NPI number"
            className={errors.npiNumber ? "border-red-500" : ""}
          />
          {errors.npiNumber && <p className="text-sm text-red-500">{errors.npiNumber}</p>}
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Specialties</Label>
          <div className="flex flex-wrap gap-2 mb-2">
            {state.specialties.map((specialty) => (
              <Badge key={specialty} variant="secondary" className="flex items-center gap-1">
                {specialty}
                <X className="h-3 w-3 cursor-pointer" onClick={() => removeSpecialty(specialty)} />
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Select value={newSpecialty} onValueChange={setNewSpecialty}>
              <SelectTrigger className={`flex-1 ${errors.specialties ? "border-red-500" : ""}`}>
                <SelectValue placeholder="Select or type a specialty" />
              </SelectTrigger>
              <SelectContent>
                {commonSpecialties
                  .filter((specialty) => !state.specialties.includes(specialty))
                  .map((specialty) => (
                    <SelectItem key={specialty} value={specialty}>
                      {specialty}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <Button type="button" onClick={addSpecialty} disabled={!newSpecialty}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {errors.specialties && <p className="text-sm text-red-500">{errors.specialties}</p>}
        </div>

        <div className="space-y-2">
          <Label>Board Certifications (Optional)</Label>
          <div className="flex flex-wrap gap-2 mb-2">
            {state.boardCertifications.map((certification) => (
              <Badge key={certification} variant="secondary" className="flex items-center gap-1">
                {certification}
                <X className="h-3 w-3 cursor-pointer" onClick={() => removeCertification(certification)} />
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={newCertification}
              onChange={(e) => setNewCertification(e.target.value)}
              placeholder="Enter board certification"
              className="flex-1"
            />
            <Button type="button" onClick={addCertification} disabled={!newCertification}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
