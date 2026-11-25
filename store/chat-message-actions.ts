import { LIMITS } from "@/config/limits";
import { DEFAULT_MODEL_ID } from "@/config/models";
import { isModelAllowed } from "@/lib/api/entitlements";
import { createId } from "@/lib/id";
import { storage } from "@/lib/storage";
import { useComposerStore } from "@/store/composer-store";
import { useFeedbackStore } from "@/store/feedback-store";
import { usePreferencesStore } from "@/store/preferences-store";
import { adoptThread, previewFrom, titleFrom, toHistory } from "@/store/chat-store-helpers";
import { abortActiveStream, streamInto } from "@/store/chat-stream";
import { INCOGNITO_ID } from "@/store/chat-store-types";
import type { ChatGet, ChatSet, ChatState } from "@/store/chat-store-types";
import type { Message } from "@/types/chat";

type MessageActions = Pick<
  ChatState,
  "sendMessage" | "regenerateMessage" | "stopStreaming" | "clearIncognito"
>;

export const createMessageActions = (set: ChatSet, get: ChatGet): MessageActions => ({
  async sendMessage({ content, attachments, modelId, tools, conversationId }) {
    const trimmed = content.trim();
    if (!trimmed || get().streamingMessageId) return;

    const id = conversationId ?? get().activeId ?? get().createConversation(modelId);
    const now = new Date().toISOString();

    const userMessage: Message = {
      id: createId("msg"),
      conversationId: id,
      role: "user",
      content: trimmed,
      status: "complete",
      createdAt: now,
      attachments: attachments.length > 0 ? attachments : undefined,
    };

    const assistantMessage: Message = {
      id: createId("msg"),
      conversationId: id,
      role: "assistant",
      content: "",
      status: "streaming",
      createdAt: new Date(Date.now() + 1).toISOString(),
      modelId,
      parentId: userMessage.id,
    };

    const existing = get().messages[id] ?? [];
    const isFirstTurn = existing.length === 0;

    set((state) => {
      const conversations = state.conversations.map((conversation) =>
        conversation.id === id
          ? {
              ...conversation,
              title: isFirstTurn ? titleFrom(trimmed) : conversation.title,
              preview: previewFrom(trimmed),
              updatedAt: now,
              modelId,
              messageCount: conversation.messageCount + 2,
            }
          : conversation,
      );

      return {
        conversations,
        messages: { ...state.messages, [id]: [...existing, userMessage, assistantMessage] },
        activeId: id,
        streamingMessageId: assistantMessage.id,
        error: null,
      };
    });

    // incognito is never written; the "keep history" setting extends that to every thread
    const ephemeral = id === INCOGNITO_ID || !usePreferencesStore.getState().saveHistory;

    const conversation = ephemeral
      ? undefined
      : get().conversations.find((item) => item.id === id);
    if (conversation) {
      await adoptThread(conversation, existing);
      await storage.appendMessage(userMessage);
      await storage.appendMessage(assistantMessage);
    }

    await streamInto(set, get, {
      conversationId: id,
      assistantId: assistantMessage.id,
      history: toHistory([...existing, userMessage]),
      modelId,
      tools,
      ephemeral,
    });
  },

  async regenerateMessage(messageId) {
    // one stream at a time, there is a single abort controller
    if (get().streamingMessageId) return;

    const entry = Object.entries(get().messages).find(([, thread]) =>
      thread.some((message) => message.id === messageId),
    );
    if (!entry) return;

    const [conversationId, thread] = entry;
    const index = thread.findIndex((message) => message.id === messageId);
    const target = thread[index];
    if (target.role !== "assistant") return;

    const promptIndex = thread.slice(0, index).findLastIndex((item) => item.role === "user");
    if (promptIndex < 0) return;

    const conversation = get().conversations.find((item) => item.id === conversationId);
    const previousModelId = target.modelId ?? conversation?.modelId ?? DEFAULT_MODEL_ID;
    // A bundled thread may carry a model the current limits don't allow.
    const modelId = isModelAllowed(previousModelId, LIMITS) ? previousModelId : DEFAULT_MODEL_ID;

    // clear in place rather than append, so later turns keep their position
    const reset: Message = {
      ...target,
      content: "",
      status: "streaming",
      modelId,
      parentId: thread[promptIndex].id,
      reasoning: undefined,
      usage: undefined,
      error: undefined,
      canvas: undefined,
      links: undefined,
      attachments: undefined,
    };

    set((state) => ({
      messages: {
        ...state.messages,
        [conversationId]: (state.messages[conversationId] ?? []).map((message) =>
          message.id === messageId ? reset : message,
        ),
      },
      streamingMessageId: messageId,
      error: null,
    }));

    // the feedback was about text the user won't see anymore
    useFeedbackStore.getState().clearVote(messageId);

    const ephemeral =
      conversationId === INCOGNITO_ID || !usePreferencesStore.getState().saveHistory;
    if (!ephemeral && conversation) await adoptThread(conversation, thread);

    await streamInto(set, get, {
      conversationId,
      assistantId: messageId,
      history: toHistory(thread.slice(0, promptIndex + 1)),
      modelId,
      // composer tools: a retry must behave like resending the question now
      tools: useComposerStore.getState().enabledTools,
      ephemeral,
    });
  },

  stopStreaming() {
    abortActiveStream();
  },

  clearIncognito() {
    abortActiveStream();
    set((state) => {
      const messages = { ...state.messages };
      delete messages[INCOGNITO_ID];
      return { messages, streamingMessageId: null };
    });
  },
});
