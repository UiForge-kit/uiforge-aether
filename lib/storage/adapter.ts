import type { Conversation, Message } from "@/types/chat";

// what you implement to plug a backend. everything is async, even the localStorage version, so IndexedDB or a remote API can replace it
export interface ChatStorage {
  listConversations(): Promise<Conversation[]>;
  getMessages(conversationId: string): Promise<Message[]>;
  upsertConversation(conversation: Conversation): Promise<void>;
  appendMessage(message: Message): Promise<void>;
  patchMessage(id: string, patch: Partial<Message>): Promise<void>;
  deleteConversation(id: string): Promise<void>;
  reset(): Promise<void>;
}
