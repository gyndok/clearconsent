"use client"

import type React from "react"

import { useState } from "react"
import { Paperclip, Send } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"

interface MessageComposerProps {
  conversationId: string
}

export function MessageComposer({ conversationId }: MessageComposerProps) {
  const [message, setMessage] = useState("")
  const [sending, setSending] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!message.trim()) return

    setSending(true)

    try {
      // In a real app, you would send the message to an API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Clear the message input after successful send
      setMessage("")

      toast({
        title: "Message sent",
        description: "Your message has been sent successfully.",
      })
    } catch (error) {
      toast({
        title: "Failed to send message",
        description: "There was an error sending your message. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        placeholder="Type your message here..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="min-h-[100px]"
      />
      <div className="flex justify-between">
        <Button type="button" variant="outline" size="sm">
          <Paperclip className="mr-2 h-4 w-4" />
          Attach File
        </Button>
        <Button type="submit" disabled={!message.trim() || sending}>
          {sending ? "Sending..." : "Send Message"}
          <Send className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </form>
  )
}
