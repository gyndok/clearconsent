"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
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
import { MoreHorizontal, FileText, Video, Calendar, ArrowUpDown, Eye, Edit, Copy, Trash, Users } from "lucide-react"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { toast } from "@/hooks/use-toast"

// Mock data for procedures
const procedures = [
  {
    id: "1",
    title: "Knee Arthroscopy",
    description: "Minimally invasive knee surgery",
    category: "Orthopedic",
    hasVideo: true,
    hasPDF: true,
    dateCreated: "2025-01-05",
    lastUpdated: "2025-01-15",
    assignedCount: 15,
  },
  {
    id: "2",
    title: "Cataract Surgery",
    description: "Removal of the lens of the eye",
    category: "Ophthalmology",
    hasVideo: true,
    hasPDF: true,
    dateCreated: "2025-01-08",
    lastUpdated: "2025-01-20",
    assignedCount: 23,
  },
  {
    id: "3",
    title: "Colonoscopy",
    description: "Examination of the large intestine",
    category: "Gastroenterology",
    hasVideo: false,
    hasPDF: true,
    dateCreated: "2025-01-10",
    lastUpdated: "2025-01-10",
    assignedCount: 18,
  },
  {
    id: "4",
    title: "Dental Implant",
    description: "Artificial tooth root placement",
    category: "Dental",
    hasVideo: true,
    hasPDF: true,
    dateCreated: "2025-01-12",
    lastUpdated: "2025-01-18",
    assignedCount: 9,
  },
  {
    id: "5",
    title: "Carpal Tunnel Release",
    description: "Surgery to treat carpal tunnel syndrome",
    category: "Orthopedic",
    hasVideo: false,
    hasPDF: true,
    dateCreated: "2025-01-15",
    lastUpdated: "2025-01-15",
    assignedCount: 7,
  },
  {
    id: "6",
    title: "Tonsillectomy",
    description: "Surgical removal of the tonsils",
    category: "ENT",
    hasVideo: true,
    hasPDF: true,
    dateCreated: "2025-01-18",
    lastUpdated: "2025-01-25",
    assignedCount: 12,
  },
  {
    id: "7",
    title: "Appendectomy",
    description: "Surgical removal of the appendix",
    category: "General Surgery",
    hasVideo: true,
    hasPDF: true,
    dateCreated: "2025-01-20",
    lastUpdated: "2025-01-20",
    assignedCount: 5,
  },
  {
    id: "8",
    title: "Hernia Repair",
    description: "Surgical correction of a hernia",
    category: "General Surgery",
    hasVideo: true,
    hasPDF: true,
    dateCreated: "2025-01-22",
    lastUpdated: "2025-01-28",
    assignedCount: 8,
  },
  {
    id: "9",
    title: "Hysterectomy",
    description: "Surgical removal of the uterus",
    category: "Gynecology",
    hasVideo: true,
    hasPDF: true,
    dateCreated: "2025-01-25",
    lastUpdated: "2025-01-30",
    assignedCount: 6,
  },
  {
    id: "10",
    title: "Rhinoplasty",
    description: "Surgical modification of the nose",
    category: "Plastic Surgery",
    hasVideo: true,
    hasPDF: true,
    dateCreated: "2025-01-28",
    lastUpdated: "2025-02-05",
    assignedCount: 4,
  },
]

interface ProceduresTableProps {
  searchQuery: string
  categoryFilter: string | null
  mediaFilter: string | null
}

export function ProceduresTable({ searchQuery, categoryFilter, mediaFilter }: ProceduresTableProps) {
  const [sortField, setSortField] = useState("title")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5
  const router = useRouter()

  // Filter procedures based on search query and filters
  const filteredProcedures = procedures.filter((procedure) => {
    // Search filter
    const matchesSearch =
      procedure.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      procedure.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      procedure.category.toLowerCase().includes(searchQuery.toLowerCase())

    // Category filter
    const matchesCategory = !categoryFilter || procedure.category === categoryFilter

    // Media filter
    let matchesMedia = true
    if (mediaFilter === "video") {
      matchesMedia = procedure.hasVideo
    } else if (mediaFilter === "pdf") {
      matchesMedia = procedure.hasPDF
    } else if (mediaFilter === "both") {
      matchesMedia = procedure.hasVideo && procedure.hasPDF
    } else if (mediaFilter === "none") {
      matchesMedia = !procedure.hasVideo && !procedure.hasPDF
    }

    return matchesSearch && matchesCategory && matchesMedia
  })

  // Sort procedures based on sort field and direction
  const sortedProcedures = [...filteredProcedures].sort((a, b) => {
    if (sortField === "title") {
      return sortDirection === "asc" ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)
    } else if (sortField === "category") {
      return sortDirection === "asc" ? a.category.localeCompare(b.category) : b.category.localeCompare(a.category)
    } else if (sortField === "dateCreated") {
      return sortDirection === "asc"
        ? new Date(a.dateCreated).getTime() - new Date(b.dateCreated).getTime()
        : new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime()
    } else if (sortField === "lastUpdated") {
      return sortDirection === "asc"
        ? new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime()
        : new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
    } else if (sortField === "assignedCount") {
      return sortDirection === "asc" ? a.assignedCount - b.assignedCount : b.assignedCount - a.assignedCount
    }
    return 0
  })

  // Paginate procedures
  const totalPages = Math.ceil(sortedProcedures.length / itemsPerPage)
  const paginatedProcedures = sortedProcedures.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const handleDelete = (id: string, title: string) => {
    // In a real app, this would be an API call to delete the procedure
    toast({
      title: "Procedure deleted",
      description: `"${title}" has been deleted.`,
    })
  }

  const handleDuplicate = (id: string, title: string) => {
    // In a real app, this would be an API call to duplicate the procedure
    toast({
      title: "Procedure duplicated",
      description: `A copy of "${title}" has been created.`,
    })
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">
                <div className="flex items-center cursor-pointer" onClick={() => handleSort("title")}>
                  Title
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead className="hidden md:table-cell">
                <div className="flex items-center cursor-pointer" onClick={() => handleSort("category")}>
                  Category
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead className="hidden lg:table-cell">Media</TableHead>
              <TableHead className="hidden lg:table-cell">
                <div className="flex items-center cursor-pointer" onClick={() => handleSort("lastUpdated")}>
                  Last Updated
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center cursor-pointer" onClick={() => handleSort("assignedCount")}>
                  Assigned
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead className="w-[60px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedProcedures.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No procedures found.
                </TableCell>
              </TableRow>
            ) : (
              paginatedProcedures.map((procedure) => (
                <TableRow key={procedure.id}>
                  <TableCell className="font-medium">
                    <div>
                      <div>{procedure.title}</div>
                      <div className="text-sm text-muted-foreground hidden sm:block">{procedure.description}</div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge variant="outline">{procedure.category}</Badge>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <div className="flex space-x-1">
                      {procedure.hasPDF && (
                        <Badge variant="outline" className="flex items-center gap-1">
                          <FileText className="h-3 w-3" />
                          PDF
                        </Badge>
                      )}
                      {procedure.hasVideo && (
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Video className="h-3 w-3" />
                          Video
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                      {new Date(procedure.lastUpdated).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                      {procedure.assignedCount}
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
                        <DropdownMenuItem onClick={() => router.push(`/procedures/${procedure.id}`)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push(`/procedures/${procedure.id}/edit`)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit procedure
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleDuplicate(procedure.id, procedure.title)}>
                          <Copy className="mr-2 h-4 w-4" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push(`/procedures/${procedure.id}/record-video`)}>
                          <Video className="mr-2 h-4 w-4" />
                          Record video
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDelete(procedure.id, procedure.title)}
                          className="text-red-600"
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Delete procedure
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
