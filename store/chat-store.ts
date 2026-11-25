"use client";

import { create } from "zustand";
import { createConversationActions } from "@/store/chat-conversation-actions";
import { createMessageActions } from "@/store/chat-message-actions";
import type { ChatState } from "@/store/chat-store-types";

export { INCOGNITO_ID } from "@/store/chat-store-types";

// slices: conversation actions and message actions (spread below) share this state.
// every mutation updates memory first, then writes to `ChatStorage` in the background
export const useChatStore = create<ChatState>((set, get) => ({
  conversations: [],
  messages: {},
  activeId: null,
  streamingMessageId: null,
  hydrated: false,
  error: null,

  ...createConversationActions(set, get),
  ...createMessageActions(set, get),
}));
