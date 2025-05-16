"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Filter, Search, X } from "lucide-react"

// Mock data for procedure categories
const procedureCategories = [
  "All Categories",
  "Orthopedic",
  "Cardiology",
  "Gastroenterology",
  "Neurology",
  "Ophthalmology",
  "Dental",
  "ENT",
  "General Surgery",
  "Gynecology",
  "Plastic Surgery",
  "Urology",
  "Dermatology",
]

interface ProcedureFiltersProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  categoryFilter: string | null
  onCategoryChange: (value: string | null) => void
  mediaFilter: string | null
  onMediaChange: (value: string | null) => void
}

export function ProcedureFilters({
  searchQuery,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  mediaFilter,
  onMediaChange,
}: ProcedureFiltersProps) {
  const [showFilters, setShowFilters] = useState(false)

  const clearFilters = () => {
    onCategoryChange(null)
    onMediaChange(null)
  }

  const hasActiveFilters = categoryFilter || mediaFilter

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search procedures..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-9 w-full sm:w-[300px]"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </Button>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="flex items-center gap-2 text-muted-foreground"
            >
              <X className="h-4 w-4" />
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      {showFilters && (
        <Card>
          <CardContent className="p-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select
                  value={categoryFilter || ""}
                  onValueChange={(value) => onCategoryChange(value === "All Categories" ? null : value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    {procedureCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Media Type</label>
                <Select value={mediaFilter || ""} onValueChange={(value) => onMediaChange(value || null)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any Media" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any Media</SelectItem>
                    <SelectItem value="video">Has Video</SelectItem>
                    <SelectItem value="pdf">Has PDF</SelectItem>
                    <SelectItem value="both">Has Both</SelectItem>
                    <SelectItem value="none">No Media</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
