"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { toast } from "@/hooks/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Mock patient data
const mockPatients = [
  {
    id: "p1",
    name: "John Smith",
    email: "john.smith@example.com",
    avatar: "/diverse-avatars.png",
  },
  {
    id: "p2",
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    avatar: "/diverse-avatars.png",
  },
  {
    id: "p3",
    name: "Michael Brown",
    email: "michael.brown@example.com",
    avatar: "/diverse-avatars.png",
  },
  {
    id: "p4",
    name: "Emily Davis",
    email: "emily.davis@example.com",
    avatar: "/diverse-avatars.png",
  },
  {
    id: "p5",
    name: "Robert Wilson",
    email: "robert.wilson@example.com",
    avatar: "/diverse-avatars.png",
  },
]

export function NewMessageForm() {
  const router = useRouter()
  const [selectedPatient, setSelectedPatient] = useState<(typeof mockPatients)[0] | null>(null)
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [patientSearchOpen, setPatientSearchOpen] = useState(false)
  const [sending, setSending] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedPatient || !subject.trim() || !message.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setSending(true)

    try {
      // In a real app, you would send the message to an API
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Message sent",
        description: `Your message has been sent to ${selectedPatient.name}.`,
      })

      // Redirect to the messages list
      router.push("/messages")
    } catch (error) {
      toast({
        title: "Failed to send message",
        description: "There was an error sending your message. Please try again.",
        variant: "destructive",
      })
      setSending(false)
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="patient">Patient</Label>
            <Popover open={patientSearchOpen} onOpenChange={setPatientSearchOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={patientSearchOpen}
                  className="w-full justify-between"
                >
                  {selectedPatient ? (
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={selectedPatient.avatar || "/placeholder.svg"} alt={selectedPatient.name} />
                        <AvatarFallback>
                          {selectedPatient.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span>{selectedPatient.name}</span>
                    </div>
                  ) : (
                    "Select patient..."
                  )}
                  <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[300px] p-0">
                <Command>
                  <CommandInput placeholder="Search patients..." />
                  <CommandList>
                    <CommandEmpty>No patients found.</CommandEmpty>
                    <CommandGroup>
                      {mockPatients.map((patient) => (
                        <CommandItem
                          key={patient.id}
                          onSelect={() => {
                            setSelectedPatient(patient)
                            setPatientSearchOpen(false)
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={patient.avatar || "/placeholder.svg"} alt={patient.name} />
                              <AvatarFallback>
                                {patient.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">{patient.name}</p>
                              <p className="text-xs text-muted-foreground">{patient.email}</p>
                            </div>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter message subject"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here..."
              className="min-h-[200px]"
            />
          </div>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => router.push("/messages")}>
              Cancel
            </Button>
            <Button type="submit" disabled={sending}>
              {sending ? "Sending..." : "Send Message"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
