"use client"

import { useState } from "react"
import Link from "next/link"
import { format } from "date-fns"
import { MoreHorizontal, Circle } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Mock data for message threads
const mockMessages = [
  {
    id: "1",
    patient: {
      id: "p1",
      name: "John Smith",
      avatar: "/diverse-avatars.png",
    },
    subject: "Question about knee surgery recovery",
    preview: "I've been experiencing some swelling after the procedure. Is this normal?",
    lastMessageDate: new Date("2025-01-15T14:30:00"),
    unread: true,
    messageCount: 4,
  },
  {
    id: "2",
    patient: {
      id: "p2",
      name: "Sarah Johnson",
      avatar: "/diverse-avatars.png",
    },
    subject: "Pre-op instructions",
    preview: "Thank you for sending the instructions. I have a question about fasting before the procedure.",
    lastMessageDate: new Date("2025-01-14T09:15:00"),
    unread: false,
    messageCount: 6,
  },
  {
    id: "3",
    patient: {
      id: "p3",
      name: "Michael Brown",
      avatar: "/diverse-avatars.png",
    },
    subject: "Medication refill request",
    preview: "I'm running low on my pain medication. Would it be possible to get a refill?",
    lastMessageDate: new Date("2025-01-13T16:45:00"),
    unread: true,
    messageCount: 2,
  },
  {
    id: "4",
    patient: {
      id: "p4",
      name: "Emily Davis",
      avatar: "/diverse-avatars.png",
    },
    subject: "Follow-up appointment",
    preview: "I need to reschedule my follow-up appointment next week. What times are available?",
    lastMessageDate: new Date("2025-01-12T11:20:00"),
    unread: false,
    messageCount: 8,
  },
  {
    id: "5",
    patient: {
      id: "p5",
      name: "Robert Wilson",
      avatar: "/diverse-avatars.png",
    },
    subject: "Physical therapy question",
    preview: "How soon after surgery should I start physical therapy? The instructions weren't clear.",
    lastMessageDate: new Date("2025-01-11T15:10:00"),
    unread: false,
    messageCount: 3,
  },
]

export function MessagesTable() {
  const [messages, setMessages] = useState(mockMessages)

  const toggleReadStatus = (id: string) => {
    setMessages(messages.map((message) => (message.id === id ? { ...message, unread: !message.unread } : message)))
  }

  const formatMessageDate = (date: Date) => {
    const now = new Date()
    const isToday = date.toDateString() === now.toDateString()

    if (isToday) {
      return format(date, "h:mm a")
    }

    const isThisYear = date.getFullYear() === now.getFullYear()
    return isThisYear ? format(date, "MMM d") : format(date, "MMM d, yyyy")
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Patient</TableHead>
            <TableHead>Subject & Preview</TableHead>
            <TableHead className="w-[100px] text-right">Date</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {messages.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center">
                No messages found.
              </TableCell>
            </TableRow>
          ) : (
            messages.map((message) => (
              <TableRow key={message.id} className={message.unread ? "bg-muted/50 font-medium" : ""}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    {message.unread && <Circle className="h-2 w-2 fill-primary text-primary" />}
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={message.patient.avatar || "/placeholder.svg"} alt={message.patient.name} />
                      <AvatarFallback>
                        {message.patient.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <Link href={`/messages/${message.id}`} className="font-medium hover:underline">
                        {message.patient.name}
                      </Link>
                      <div className="text-xs text-muted-foreground">{message.messageCount} messages</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Link href={`/messages/${message.id}`} className="block hover:underline">
                    <div className="font-medium">{message.subject}</div>
                    <div className="truncate text-sm text-muted-foreground">{message.preview}</div>
                  </Link>
                </TableCell>
                <TableCell className="text-right text-sm text-muted-foreground">
                  {formatMessageDate(message.lastMessageDate)}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => toggleReadStatus(message.id)}>
                        Mark as {message.unread ? "read" : "unread"}
                      </DropdownMenuItem>
                      <DropdownMenuItem>Archive</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>View patient profile</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
