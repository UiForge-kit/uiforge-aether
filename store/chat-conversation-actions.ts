import { LIMITS } from "@/config/limits";
import { DEFAULT_MODEL_ID } from "@/config/models";
import { createId } from "@/lib/id";
import { createSeedConversations, createSeedMessages } from "@/lib/mock/conversations";
import { storage } from "@/lib/storage";
import { selectOverflow } from "@/lib/storage/overflow";
import { usePreferencesStore } from "@/store/preferences-store";
import type { ChatGet, ChatSet, ChatState } from "@/store/chat-store-types";
import type { Conversation, Message } from "@/types/chat";

type ConversationActions = Pick<
  ChatState,
  | "hydrate"
  | "setActive"
  | "createConversation"
  | "deleteConversation"
  | "renameConversation"
  | "togglePin"
  | "resetDemo"
>;

export const createConversationActions = (set: ChatSet, get: ChatGet): ConversationActions => ({
  async hydrate() {
    if (get().hydrated) return;

    const seedConversations = createSeedConversations();
    const seedMessages = createSeedMessages();

    const localConversations = await storage.listConversations();

    // local conversations win, they carry the session's turns
    const byId = new Map(seedConversations.map((item) => [item.id, item]));
    for (const conversation of localConversations) byId.set(conversation.id, conversation);

    const messages: Record<string, Message[]> = { ...seedMessages };
    await Promise.all(
      localConversations.map(async (conversation) => {
        const thread = await storage.getMessages(conversation.id);
        if (thread.length > 0) messages[conversation.id] = thread;
      }),
    );

    set({ conversations: [...byId.values()], messages, hydrated: true });
  },

  setActive(id) {
    set({ activeId: id, error: null });
  },

  createConversation(modelId = DEFAULT_MODEL_ID) {
    const now = new Date().toISOString();
    const conversation: Conversation = {
      id: createId("conv"),
      title: "Nouvelle conversation",
      preview: "",
      createdAt: now,
      updatedAt: now,
      modelId,
      messageCount: 0,
      pinned: false,
      archived: false,
      origin: "local",
    };

    set((state) => {
      const conversations = [conversation, ...state.conversations];
      const dropped = new Set(selectOverflow(conversations, LIMITS.maxConversations));
      const messages = { ...state.messages, [conversation.id]: [] };
      for (const id of dropped) delete messages[id];

      return {
        conversations: conversations.filter((item) => !dropped.has(item.id)),
        messages,
        activeId: conversation.id,
        error: null,
      };
    });

    // written right away: a thread created from a project must survive a reload even if empty
    if (usePreferencesStore.getState().saveHistory) {
      void storage.upsertConversation(conversation);
    }

    return conversation.id;
  },


  async deleteConversation(id) {
    set((state) => {
      const messages = { ...state.messages };
      delete messages[id];
      return {
        conversations: state.conversations.filter((item) => item.id !== id),
        messages,
        activeId: state.activeId === id ? null : state.activeId,
      };
    });
    await storage.deleteConversation(id);
  },

  async renameConversation(id, title) {
    const clean = title.trim();
    if (!clean) return;

    set((state) => ({
      conversations: state.conversations.map((item) =>
        item.id === id ? { ...item, title: clean } : item,
      ),
    }));

    const conversation = get().conversations.find((item) => item.id === id);
    if (conversation) await storage.upsertConversation({ ...conversation, origin: "local" });
  },

  async togglePin(id) {
    set((state) => ({
      conversations: state.conversations.map((item) =>
        item.id === id ? { ...item, pinned: !item.pinned } : item,
      ),
    }));

    const conversation = get().conversations.find((item) => item.id === id);
    if (conversation) await storage.upsertConversation({ ...conversation, origin: "local" });
  },

  async resetDemo() {
    await storage.reset();
    set({
      conversations: createSeedConversations(),
      messages: createSeedMessages(),
      activeId: null,
      error: null,
    });
  },
});
