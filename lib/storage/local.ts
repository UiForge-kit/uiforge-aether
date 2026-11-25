import { LIMITS } from "@/config/limits";
import { STORAGE_NAMESPACE } from "@/config/site";
import type { Conversation, Message } from "@/types/chat";
import type { ChatStorage } from "./adapter";
import { selectOverflow } from "./overflow";

// two keys: the conversation index and the message bodies. splitting avoids rewriting every message on a title change
// the oldest unpinned local conversations are purged past `LIMITS.maxConversations`

const KEY_CONVERSATIONS = `${STORAGE_NAMESPACE}:conversations`;
const KEY_MESSAGES = `${STORAGE_NAMESPACE}:messages`;

type MessageIndex = Record<string, Message[]>;

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function read<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    // corrupted data: start empty rather than crash on boot
    return fallback;
  }
}

function write(key: string, value: unknown): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // quota exceeded: session keeps working, only persistence is lost
  }
}

export const localChatStorage: ChatStorage = {
  async listConversations() {
    return read<Conversation[]>(KEY_CONVERSATIONS, []);
  },

  async getMessages(conversationId) {
    return read<MessageIndex>(KEY_MESSAGES, {})[conversationId] ?? [];
  },

  async upsertConversation(conversation) {
    const all = read<Conversation[]>(KEY_CONVERSATIONS, []);
    const index = all.findIndex((item) => item.id === conversation.id);
    if (index >= 0) all[index] = conversation;
    else all.unshift(conversation);

    const dropped = new Set(selectOverflow(all, LIMITS.maxConversations));
    write(
      KEY_CONVERSATIONS,
      all.filter((item) => !dropped.has(item.id)),
    );

    if (dropped.size > 0) {
      const messages = read<MessageIndex>(KEY_MESSAGES, {});
      for (const id of dropped) delete messages[id];
      write(KEY_MESSAGES, messages);
    }
  },

  async appendMessage(message) {
    const index = read<MessageIndex>(KEY_MESSAGES, {});
    const thread = index[message.conversationId] ?? [];
    index[message.conversationId] = [...thread, message];
    write(KEY_MESSAGES, index);
  },

  async patchMessage(id, patch) {
    const index = read<MessageIndex>(KEY_MESSAGES, {});
    for (const [conversationId, thread] of Object.entries(index)) {
      const position = thread.findIndex((message) => message.id === id);
      if (position < 0) continue;
      const next = [...thread];
      next[position] = { ...next[position], ...patch };
      index[conversationId] = next;
      write(KEY_MESSAGES, index);
      return;
    }
  },

  async deleteConversation(id) {
    write(
      KEY_CONVERSATIONS,
      read<Conversation[]>(KEY_CONVERSATIONS, []).filter((item) => item.id !== id),
    );
    const index = read<MessageIndex>(KEY_MESSAGES, {});
    delete index[id];
    write(KEY_MESSAGES, index);
  },

  async reset() {
    if (!isBrowser()) return;
    window.localStorage.removeItem(KEY_CONVERSATIONS);
    window.localStorage.removeItem(KEY_MESSAGES);
  },
};
