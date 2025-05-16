"use client"

import Link from "next/link"
import { Archive, Flag, Printer, MoreHorizontal } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Mock data for a conversation
const mockConversation = {
  id: "1",
  patient: {
    id: "p1",
    name: "John Smith",
    avatar: "/diverse-avatars.png",
    email: "john.smith@example.com",
    phone: "(555) 123-4567",
  },
  subject: "Question about knee surgery recovery",
}

interface ConversationHeaderProps {
  conversationId: string
}

export function ConversationHeader({ conversationId }: ConversationHeaderProps) {
  // In a real app, you would fetch the conversation data based on the ID
  const conversation = mockConversation

  return (
    <div className="flex items-center justify-between border-b p-4">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={conversation.patient.avatar || "/placeholder.svg"} alt={conversation.patient.name} />
          <AvatarFallback>
            {conversation.patient.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">{conversation.patient.name}</h2>
            <Button variant="link" size="sm" asChild className="p-0 h-auto">
              <Link href={`/patients/${conversation.patient.id}`}>View Profile</Link>
            </Button>
          </div>
          <div className="text-sm text-muted-foreground">
            <span className="mr-2">{conversation.patient.email}</span>
            <span>{conversation.patient.phone}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon">
          <Archive className="h-4 w-4" />
          <span className="sr-only">Archive</span>
        </Button>
        <Button variant="ghost" size="icon">
          <Flag className="h-4 w-4" />
          <span className="sr-only">Flag</span>
        </Button>
        <Button variant="ghost" size="icon">
          <Printer className="h-4 w-4" />
          <span className="sr-only">Print</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">More options</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Mark all as read</DropdownMenuItem>
            <DropdownMenuItem>Export conversation</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Report issue</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
