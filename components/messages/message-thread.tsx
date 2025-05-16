"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { Check, CheckCheck } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"

// Mock data for messages in a thread
const mockMessages = [
  {
    id: "m1",
    content: "I've been experiencing some swelling after the procedure. Is this normal?",
    sender: "patient",
    timestamp: new Date("2025-01-15T14:30:00"),
    read: true,
  },
  {
    id: "m2",
    content:
      "Yes, some swelling is normal after knee surgery. It's part of the body's natural healing process. Are you elevating your leg as instructed?",
    sender: "doctor",
    timestamp: new Date("2025-01-15T15:05:00"),
    read: true,
  },
  {
    id: "m3",
    content:
      "I've been trying to, but it's difficult to keep it elevated while sleeping. Should I be using more pillows?",
    sender: "patient",
    timestamp: new Date("2025-01-15T15:20:00"),
    read: true,
  },
  {
    id: "m4",
    content:
      "Yes, using 2-3 pillows to keep your knee above the level of your heart while sleeping is recommended. Also, make sure you're applying ice for 20 minutes every 2-3 hours during the day. This will help reduce swelling. If the swelling worsens or is accompanied by increased pain or redness, please let me know immediately.",
    sender: "doctor",
    timestamp: new Date("2025-01-15T15:45:00"),
    read: false,
  },
]

// Mock patient and doctor data
const mockPatient = {
  id: "p1",
  name: "John Smith",
  avatar: "/diverse-avatars.png",
}

const mockDoctor = {
  id: "d1",
  name: "Dr. Jane Wilson",
  avatar: "/caring-doctor.png",
}

interface MessageThreadProps {
  conversationId: string
}

export function MessageThread({ conversationId }: MessageThreadProps) {
  const [messages, setMessages] = useState<typeof mockMessages | null>(null)
  const [loading, setLoading] = useState(true)

  // Simulate fetching messages
  useEffect(() => {
    const fetchMessages = async () => {
      // In a real app, you would fetch messages from an API
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setMessages(mockMessages)
      setLoading(false)
    }

    fetchMessages()
  }, [conversationId])

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-20 w-[400px]" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!messages || messages.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">No messages in this conversation.</div>
  }

  return (
    <div className="space-y-6">
      {messages.map((message) => {
        const isDoctor = message.sender === "doctor"
        const avatar = isDoctor ? mockDoctor.avatar : mockPatient.avatar
        const name = isDoctor ? mockDoctor.name : mockPatient.name

        return (
          <div key={message.id} className={`flex gap-4 ${isDoctor ? "flex-row" : "flex-row-reverse"}`}>
            <Avatar className="h-10 w-10 mt-1">
              <AvatarImage src={avatar || "/placeholder.svg"} alt={name} />
              <AvatarFallback>
                {name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className={`max-w-[80%] space-y-1 ${isDoctor ? "items-start" : "items-end"}`}>
              <div className={`rounded-lg p-4 ${isDoctor ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                <p className="whitespace-pre-wrap">{message.content}</p>
              </div>
              <div
                className={`flex items-center gap-1 text-xs text-muted-foreground ${
                  isDoctor ? "justify-start" : "justify-end"
                }`}
              >
                <span>{format(message.timestamp, "h:mm a")}</span>
                {isDoctor && (
                  <span>{message.read ? <CheckCheck className="h-3 w-3" /> : <Check className="h-3 w-3" />}</span>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
