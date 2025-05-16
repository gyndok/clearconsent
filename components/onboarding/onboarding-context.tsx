"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

// Define the shape of our onboarding state
export interface OnboardingState {
  // Step 1: Basic Info
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: Date | null
  gender: string

  // Step 2: Credentials
  medicalLicense: string
  licenseState: string
  npiNumber: string
  specialties: string[]
  boardCertifications: string[]

  // Step 3: Practice
  practiceName: string
  practiceType: string
  practiceAddress: string
  practiceCity: string
  practiceState: string
  practiceZip: string
  practicePhone: string
  practiceWebsite: string

  // Step 4: Account Setup
  preferredLanguages: string[]
  notificationPreferences: {
    email: boolean
    sms: boolean
    push: boolean
  }
  defaultAvailability: string[]
}

// Initial state
const initialState: OnboardingState = {
  // Step 1: Basic Info
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  dateOfBirth: null,
  gender: "",

  // Step 2: Credentials
  medicalLicense: "",
  licenseState: "",
  npiNumber: "",
  specialties: [],
  boardCertifications: [],

  // Step 3: Practice
  practiceName: "",
  practiceType: "",
  practiceAddress: "",
  practiceCity: "",
  practiceState: "",
  practiceZip: "",
  practicePhone: "",
  practiceWebsite: "",

  // Step 4: Account Setup
  preferredLanguages: [],
  notificationPreferences: {
    email: true,
    sms: false,
    push: false,
  },
  defaultAvailability: [],
}

// Create the context
interface OnboardingContextType {
  state: OnboardingState
  updateState: (newState: Partial<OnboardingState>) => void
  isStepValid: (step: number) => boolean
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined)

// Provider component
export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<OnboardingState>(initialState)

  const updateState = (newState: Partial<OnboardingState>) => {
    setState((prevState) => ({ ...prevState, ...newState }))
  }

  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 0: // Basic Info
        return (
          !!state.firstName &&
          !!state.lastName &&
          !!state.email &&
          !!state.phone &&
          !!state.dateOfBirth &&
          !!state.gender
        )
      case 1: // Credentials
        return !!state.medicalLicense && !!state.licenseState && !!state.npiNumber && state.specialties.length > 0
      case 2: // Practice
        return (
          !!state.practiceName &&
          !!state.practiceType &&
          !!state.practiceAddress &&
          !!state.practiceCity &&
          !!state.practiceState &&
          !!state.practiceZip &&
          !!state.practicePhone
        )
      case 3: // Account Setup
        return state.preferredLanguages.length > 0
      case 4: // Summary
        return true // No validation needed for summary step
      default:
        return false
    }
  }

  return <OnboardingContext.Provider value={{ state, updateState, isStepValid }}>{children}</OnboardingContext.Provider>
}

// Custom hook to use the onboarding context
export function useOnboardingState() {
  const context = useContext(OnboardingContext)
  if (context === undefined) {
    throw new Error("useOnboardingState must be used within an OnboardingProvider")
  }
  return context
}
