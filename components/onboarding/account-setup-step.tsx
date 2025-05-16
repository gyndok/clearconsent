"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { X, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useOnboardingState } from "./onboarding-context"

// Common languages
const languages = [
  "English",
  "Spanish",
  "French",
  "German",
  "Italian",
  "Portuguese",
  "Russian",
  "Mandarin",
  "Cantonese",
  "Japanese",
  "Korean",
  "Arabic",
  "Hindi",
  "Bengali",
  "Urdu",
  "Vietnamese",
  "Tagalog",
  "Thai",
  "Turkish",
  "Dutch",
]

// Days of the week
const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

export function AccountSetupStep() {
  const { state, updateState } = useOnboardingState()
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [newLanguage, setNewLanguage] = useState("")

  const validateField = (name: string, value: any) => {
    let error = ""

    switch (name) {
      case "preferredLanguages":
        if (!value || value.length === 0) error = "At least one language is required"
        break
    }

    setErrors((prev) => ({ ...prev, [name]: error }))
    return !error
  }

  const addLanguage = () => {
    if (newLanguage && !state.preferredLanguages.includes(newLanguage)) {
      const updatedLanguages = [...state.preferredLanguages, newLanguage]
      updateState({ preferredLanguages: updatedLanguages })
      validateField("preferredLanguages", updatedLanguages)
      setNewLanguage("")
    }
  }

  const removeLanguage = (language: string) => {
    const updatedLanguages = state.preferredLanguages.filter((l) => l !== language)
    updateState({ preferredLanguages: updatedLanguages })
    validateField("preferredLanguages", updatedLanguages)
  }

  const toggleDay = (day: string) => {
    const updatedDays = state.defaultAvailability.includes(day)
      ? state.defaultAvailability.filter((d) => d !== day)
      : [...state.defaultAvailability, day]
    updateState({ defaultAvailability: updatedDays })
  }

  const toggleNotification = (type: keyof typeof state.notificationPreferences) => {
    updateState({
      notificationPreferences: {
        ...state.notificationPreferences,
        [type]: !state.notificationPreferences[type],
      },
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Account Setup</h2>
        <p className="text-sm text-muted-foreground">Configure your account preferences.</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label>Languages</Label>
            <p className="text-sm text-muted-foreground mb-2">Select languages you speak with patients</p>
          </div>

          <div className="flex flex-wrap gap-2 mb-2">
            {state.preferredLanguages.map((language) => (
              <Badge key={language} variant="secondary" className="flex items-center gap-1">
                {language}
                <X className="h-3 w-3 cursor-pointer" onClick={() => removeLanguage(language)} />
              </Badge>
            ))}
          </div>

          <div className="flex gap-2">
            <Select value={newLanguage} onValueChange={setNewLanguage}>
              <SelectTrigger className={`flex-1 ${errors.preferredLanguages ? "border-red-500" : ""}`}>
                <SelectValue placeholder="Select a language" />
              </SelectTrigger>
              <SelectContent>
                {languages
                  .filter((language) => !state.preferredLanguages.includes(language))
                  .map((language) => (
                    <SelectItem key={language} value={language}>
                      {language}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <Button type="button" onClick={addLanguage} disabled={!newLanguage}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {errors.preferredLanguages && <p className="text-sm text-red-500">{errors.preferredLanguages}</p>}
        </div>

        <div className="space-y-4">
          <div>
            <Label>Notification Preferences</Label>
            <p className="text-sm text-muted-foreground mb-2">Choose how you want to receive notifications</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="emailNotifications"
                checked={state.notificationPreferences.email}
                onCheckedChange={() => toggleNotification("email")}
              />
              <label
                htmlFor="emailNotifications"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Email Notifications
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="smsNotifications"
                checked={state.notificationPreferences.sms}
                onCheckedChange={() => toggleNotification("sms")}
              />
              <label
                htmlFor="smsNotifications"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                SMS Notifications
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="pushNotifications"
                checked={state.notificationPreferences.push}
                onCheckedChange={() => toggleNotification("push")}
              />
              <label
                htmlFor="pushNotifications"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Push Notifications
              </label>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label>Default Availability (Optional)</Label>
            <p className="text-sm text-muted-foreground mb-2">Select days you're typically available</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {daysOfWeek.map((day) => (
              <div key={day} className="flex items-center space-x-2">
                <Checkbox
                  id={`day-${day}`}
                  checked={state.defaultAvailability.includes(day)}
                  onCheckedChange={() => toggleDay(day)}
                />
                <label
                  htmlFor={`day-${day}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {day}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
