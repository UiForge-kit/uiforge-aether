import type { StoreApi } from "zustand";
import type { Attachment, Conversation, Message } from "@/types/chat";
import type { ComposerToolId } from "@/types/model";

export interface SendOptions {
  content: string;
  attachments: Attachment[];
  modelId: string;
  tools: ComposerToolId[];
  conversationId?: string;
}

export interface ChatState {
  conversations: Conversation[];
  messages: Record<string, Message[]>;
  activeId: string | null;
  streamingMessageId: string | null;
  hydrated: boolean;
  error: string | null;

  hydrate: () => Promise<void>;
  setActive: (id: string | null) => void;
  createConversation: (modelId?: string) => string;
  sendMessage: (options: SendOptions) => Promise<void>;
  regenerateMessage: (messageId: string) => Promise<void>;
  stopStreaming: () => void;
  clearIncognito: () => void;
  deleteConversation: (id: string) => Promise<void>;
  renameConversation: (id: string, title: string) => Promise<void>;
  togglePin: (id: string) => Promise<void>;
  resetDemo: () => Promise<void>;
}


export type ChatSet = StoreApi<ChatState>["setState"];
export type ChatGet = StoreApi<ChatState>["getState"];

/** Incognito thread. The reserved id keeps it out of the sidebar list and off disk. */
export const INCOGNITO_ID = "__incognito__";
