import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { ConversationHeader } from "@/components/messages/conversation-header"
import { MessageThread } from "@/components/messages/message-thread"
import { MessageComposer } from "@/components/messages/message-composer"

export const metadata: Metadata = {
  title: "Conversation | ClearConsent",
  description: "View and respond to your conversation with a patient",
}

export default function ConversationPage({ params }: { params: { id: string } }) {
  // In a real app, you would fetch the conversation data based on the ID
  const conversationId = params.id

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      <div className="border-b p-4">
        <Breadcrumb
          items={[
            { title: "Dashboard", href: "/dashboard" },
            { title: "Messages", href: "/messages" },
            { title: "Conversation", href: `/messages/${conversationId}` },
          ]}
          className="mb-2"
        />

        <div className="mt-2 flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/messages">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to messages
            </Link>
          </Button>
        </div>
      </div>

      <ConversationHeader conversationId={conversationId} />

      <div className="flex-1 overflow-y-auto p-4">
        <MessageThread conversationId={conversationId} />
      </div>

      <div className="border-t p-4">
        <MessageComposer conversationId={conversationId} />
      </div>
    </div>
  )
}
