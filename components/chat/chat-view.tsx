"use client";

import { useEffect } from "react";
import { Composer } from "@/components/chat/composer";
import { ComposerIntro } from "@/components/chat/composer-intro";
import { MissingConversation } from "@/components/chat/missing-conversation";
import { Thread } from "@/components/chat/thread";
import { ScrollRegion } from "@/components/layout/scroll-region";
import { Topbar } from "@/components/topbar/topbar";
import { useChatStore } from "@/store/chat-store";
import { useUIStore } from "@/store/ui-store";
import { useConversationSection } from "@/modules/projects";

// no id renders the empty state: the composer creates the conversation and
// pushes its URL on the first message
export function ChatView({ conversationId }: { conversationId?: string }) {
  const { conversations, messages, hydrated, setActive } = useChatStore();
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);
  const parent = useConversationSection(conversationId);

  useEffect(() => {
    setActive(conversationId ?? null);
  }, [conversationId, setActive]);

  const conversation = conversationId
    ? conversations.find((item) => item.id === conversationId)
    : undefined;
  const thread = conversationId ? (messages[conversationId] ?? []) : [];
  const isEmpty = thread.length === 0;

  const missing = hydrated && conversationId !== undefined && !conversation;
  const title = conversation?.title ?? (conversationId ? "Conversation" : "Nouvelle conversation");

  return (
    <>
      <Topbar
        title={missing ? "Conversation introuvable" : title}
        section={parent?.label ?? "Chat"}
        sectionHref={parent?.href}
        onToggleSidebar={toggleSidebar}
      />

      {missing ? (
        <ScrollRegion className="flex flex-col">
          <MissingConversation conversationId={conversationId} />
        </ScrollRegion>
      ) : isEmpty ? (
        <div className="flex min-h-0 flex-1 flex-col justify-center overflow-y-auto pt-(--topbar-height)">
          <ComposerIntro />
          <Composer conversationId={conversationId} autoFocus variant="centered" />
        </div>
      ) : (
        <>
          <Thread messages={thread} />
          <Composer conversationId={conversationId} autoFocus />
        </>
      )}
    </>
  );
}
