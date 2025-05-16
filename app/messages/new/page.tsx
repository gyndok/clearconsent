import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { NewMessageForm } from "@/components/messages/new-message-form"

export const metadata: Metadata = {
  title: "New Message | ClearConsent",
  description: "Start a new conversation with a patient",
}

export default function NewMessagePage() {
  return (
    <div className="flex flex-col gap-8 p-8">
      <Breadcrumb
        items={[
          { title: "Dashboard", href: "/dashboard" },
          { title: "Messages", href: "/messages" },
          { title: "New Message", href: "/messages/new" },
        ]}
        className="mb-2"
      />

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/messages">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to messages
          </Link>
        </Button>
      </div>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">New Message</h1>
        <p className="text-muted-foreground">Start a new conversation with a patient</p>
      </div>

      <div className="mx-auto w-full max-w-3xl">
        <NewMessageForm />
      </div>
    </div>
  )
}
