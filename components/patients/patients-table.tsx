"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Plus, Search, FileText, Mail, Phone, Calendar, ArrowUpDown, Pencil } from "lucide-react"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

// Mock data for patients
const patients = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "(555) 123-4567",
    dateAdded: "2025-01-05",
    status: "Completed",
    assignedProcedures: 2,
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    phone: "(555) 234-5678",
    dateAdded: "2025-01-08",
    status: "In Progress",
    assignedProcedures: 1,
  },
  {
    id: "3",
    name: "Michael Brown",
    email: "m.brown@example.com",
    phone: "(555) 345-6789",
    dateAdded: "2025-01-10",
    status: "Viewed",
    assignedProcedures: 1,
  },
  {
    id: "4",
    name: "Emily Davis",
    email: "emily.d@example.com",
    phone: "(555) 456-7890",
    dateAdded: "2025-01-12",
    status: "Sent",
    assignedProcedures: 3,
  },
  {
    id: "5",
    name: "Robert Wilson",
    email: "r.wilson@example.com",
    phone: "(555) 567-8901",
    dateAdded: "2025-01-15",
    status: "Completed",
    assignedProcedures: 2,
  },
  {
    id: "6",
    name: "Jennifer Lee",
    email: "jennifer.lee@example.com",
    phone: "(555) 678-9012",
    dateAdded: "2025-01-18",
    status: "Not Started",
    assignedProcedures: 0,
  },
  {
    id: "7",
    name: "David Martinez",
    email: "d.martinez@example.com",
    phone: "(555) 789-0123",
    dateAdded: "2025-01-20",
    status: "In Progress",
    assignedProcedures: 2,
  },
  {
    id: "8",
    name: "Lisa Anderson",
    email: "l.anderson@example.com",
    phone: "(555) 890-1234",
    dateAdded: "2025-01-22",
    status: "Completed",
    assignedProcedures: 1,
  },
  {
    id: "9",
    name: "James Taylor",
    email: "j.taylor@example.com",
    phone: "(555) 901-2345",
    dateAdded: "2025-01-25",
    status: "Sent",
    assignedProcedures: 1,
  },
  {
    id: "10",
    name: "Patricia White",
    email: "p.white@example.com",
    phone: "(555) 012-3456",
    dateAdded: "2025-01-28",
    status: "Not Started",
    assignedProcedures: 0,
  },
]

export function PatientsTable() {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortField, setSortField] = useState("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5
  const router = useRouter()

  // Filter patients based on search query
  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.phone.includes(searchQuery),
  )

  // Sort patients based on sort field and direction
  const sortedPatients = [...filteredPatients].sort((a, b) => {
    if (sortField === "name") {
      return sortDirection === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    } else if (sortField === "dateAdded") {
      return sortDirection === "asc"
        ? new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime()
        : new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
    } else if (sortField === "status") {
      return sortDirection === "asc" ? a.status.localeCompare(b.status) : b.status.localeCompare(a.status)
    } else if (sortField === "assignedProcedures") {
      return sortDirection === "asc"
        ? a.assignedProcedures - b.assignedProcedures
        : b.assignedProcedures - a.assignedProcedures
    }
    return 0
  })

  // Paginate patients
  const totalPages = Math.ceil(sortedPatients.length / itemsPerPage)
  const paginatedPatients = sortedPatients.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-500"
      case "In Progress":
        return "bg-blue-500"
      case "Viewed":
        return "bg-yellow-500"
      case "Sent":
        return "bg-gray-500"
      case "Not Started":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search patients..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setCurrentPage(1) // Reset to first page on search
            }}
            className="h-9 w-full sm:w-[300px]"
          />
        </div>
        <Button onClick={() => router.push("/patients/add")}>
          <Plus className="mr-2 h-4 w-4" />
          Add Patient
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">
                <div className="flex items-center cursor-pointer" onClick={() => handleSort("name")}>
                  Name
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead className="hidden md:table-cell">Contact</TableHead>
              <TableHead className="hidden lg:table-cell">
                <div className="flex items-center cursor-pointer" onClick={() => handleSort("dateAdded")}>
                  Date Added
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center cursor-pointer" onClick={() => handleSort("status")}>
                  Status
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center cursor-pointer" onClick={() => handleSort("assignedProcedures")}>
                  Procedures
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead className="w-[60px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedPatients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No patients found.
                </TableCell>
              </TableRow>
            ) : (
              paginatedPatients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell className="font-medium">{patient.name}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex flex-col space-y-1">
                      <div className="flex items-center text-sm">
                        <Mail className="mr-2 h-3 w-3 text-muted-foreground" />
                        {patient.email}
                      </div>
                      <div className="flex items-center text-sm">
                        <Phone className="mr-2 h-3 w-3 text-muted-foreground" />
                        {patient.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                      {new Date(patient.dateAdded).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={`${getStatusColor(patient.status)} text-white`}>
                      {patient.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                      {patient.assignedProcedures}
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => router.push(`/patients/${patient.id}`)}>
                          View details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push(`/patients/${patient.id}/edit`)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit patient
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => router.push(`/patients/${patient.id}/assign`)}>
                          Assign procedure
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push(`/patients/${patient.id}/message`)}>
                          Send message
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => {
                            // In a real app, this would show a confirmation dialog
                            alert(`This would delete patient: ${patient.name}`)
                          }}
                          className="text-red-600"
                        >
                          Delete patient
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>

            {Array.from({ length: totalPages }).map((_, index) => (
              <PaginationItem key={index}>
                <PaginationLink onClick={() => setCurrentPage(index + 1)} isActive={currentPage === index + 1}>
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}
