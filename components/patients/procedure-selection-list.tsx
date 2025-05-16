"use client"

import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, FileText, Video } from "lucide-react"

// Mock data for procedures
const procedures = [
  {
    id: "1",
    title: "Knee Arthroscopy",
    description: "Minimally invasive knee surgery",
    hasVideo: true,
    hasPDF: true,
    category: "Orthopedic",
  },
  {
    id: "2",
    title: "Cataract Surgery",
    description: "Removal of the lens of the eye",
    hasVideo: true,
    hasPDF: true,
    category: "Ophthalmology",
  },
  {
    id: "3",
    title: "Colonoscopy",
    description: "Examination of the large intestine",
    hasVideo: false,
    hasPDF: true,
    category: "Gastroenterology",
  },
  {
    id: "4",
    title: "Dental Implant",
    description: "Artificial tooth root placement",
    hasVideo: true,
    hasPDF: true,
    category: "Dental",
  },
  {
    id: "5",
    title: "Carpal Tunnel Release",
    description: "Surgery to treat carpal tunnel syndrome",
    hasVideo: false,
    hasPDF: true,
    category: "Orthopedic",
  },
  {
    id: "6",
    title: "Tonsillectomy",
    description: "Surgical removal of the tonsils",
    hasVideo: true,
    hasPDF: true,
    category: "ENT",
  },
  {
    id: "7",
    title: "Appendectomy",
    description: "Surgical removal of the appendix",
    hasVideo: true,
    hasPDF: true,
    category: "General Surgery",
  },
  {
    id: "8",
    title: "Hernia Repair",
    description: "Surgical correction of a hernia",
    hasVideo: true,
    hasPDF: true,
    category: "General Surgery",
  },
  {
    id: "9",
    title: "Hysterectomy",
    description: "Surgical removal of the uterus",
    hasVideo: true,
    hasPDF: true,
    category: "Gynecology",
  },
  {
    id: "10",
    title: "Rhinoplasty",
    description: "Surgical modification of the nose",
    hasVideo: true,
    hasPDF: true,
    category: "Plastic Surgery",
  },
]

interface ProcedureSelectionListProps {
  value: string[]
  onChange: (value: string[]) => void
  excludeIds?: string[] // IDs of procedures to exclude (already assigned)
}

export function ProcedureSelectionList({ value, onChange, excludeIds = [] }: ProcedureSelectionListProps) {
  const [searchQuery, setSearchQuery] = useState("")

  // Filter out already assigned procedures and apply search filter
  const availableProcedures = procedures.filter(
    (procedure) =>
      !excludeIds.includes(procedure.id) &&
      (procedure.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        procedure.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        procedure.category.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const handleToggle = (id: string) => {
    if (value.includes(id)) {
      onChange(value.filter((item) => item !== id))
    } else {
      onChange([...value, id])
    }
  }

  const handleSelectAll = () => {
    if (availableProcedures.length === value.length) {
      // If all are selected, deselect all
      onChange([])
    } else {
      // Otherwise, select all available procedures
      onChange(availableProcedures.map((procedure) => procedure.id))
    }
  }

  // Group procedures by category
  const proceduresByCategory: Record<string, typeof procedures> = {}
  availableProcedures.forEach((procedure) => {
    if (!proceduresByCategory[procedure.category]) {
      proceduresByCategory[procedure.category] = []
    }
    proceduresByCategory[procedure.category].push(procedure)
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search procedures..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-9"
        />
      </div>

      {availableProcedures.length === 0 ? (
        <div className="text-center p-8 border rounded-lg">
          {excludeIds.length > 0 && procedures.length === excludeIds.length ? (
            <p className="text-muted-foreground">All procedures have already been assigned to this patient.</p>
          ) : (
            <p className="text-muted-foreground">No procedures found matching your search criteria.</p>
          )}
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {value.length} of {availableProcedures.length} selected
            </div>
            <button
              type="button"
              onClick={handleSelectAll}
              className="text-sm text-primary hover:underline focus:outline-none"
            >
              {availableProcedures.length === value.length ? "Deselect All" : "Select All"}
            </button>
          </div>

          <ScrollArea className="h-[400px] border rounded-md p-4">
            <div className="space-y-6">
              {Object.entries(proceduresByCategory).map(([category, procedures]) => (
                <div key={category} className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">{category}</h4>
                  <div className="space-y-2">
                    {procedures.map((procedure) => (
                      <div
                        key={procedure.id}
                        className="flex items-start space-x-3 rounded-md border p-3 hover:bg-muted/50 transition-colors"
                      >
                        <Checkbox
                          checked={value.includes(procedure.id)}
                          onCheckedChange={() => handleToggle(procedure.id)}
                          id={`procedure-${procedure.id}`}
                        />
                        <div className="flex-1 space-y-1 leading-none">
                          <label
                            htmlFor={`procedure-${procedure.id}`}
                            className="text-sm font-medium cursor-pointer flex items-center"
                          >
                            {procedure.title}
                            <div className="flex ml-2 space-x-1">
                              {procedure.hasPDF && <FileText className="h-3 w-3 text-muted-foreground" />}
                              {procedure.hasVideo && <Video className="h-3 w-3 text-muted-foreground" />}
                            </div>
                          </label>
                          <p className="text-sm text-muted-foreground">{procedure.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </>
      )}
    </div>
  )
}
