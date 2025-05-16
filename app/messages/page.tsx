import type { Metadata } from "next"
import Link from "next/link"
import { PlusCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { MessagesTable } from "@/components/messages/messages-table"
import { MessageFilters } from "@/components/messages/message-filters"

export const metadata: Metadata = {
  title: "Messages | ClearConsent",
  description: "View and manage your message threads with patients",
}

export default function MessagesPage() {
  return (
    <div className="flex flex-col gap-8 p-8">
      <Breadcrumb items={[{ title: "Messages", href: "/messages" }]} className="mb-2" />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
          <p className="text-muted-foreground">View and manage your conversations with patients</p>
        </div>
        <Button asChild>
          <Link href="/messages/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Message
          </Link>
        </Button>
      </div>

      <MessageFilters />
      <MessagesTable />
    </div>
  )
}
