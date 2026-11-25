import { readSSE } from "@/lib/ai/stream";
import { storage } from "@/lib/storage";
import type { ChatRequestMessage } from "@/types/ai";
import type { Message } from "@/types/chat";
import type { ComposerToolId } from "@/types/model";
import type { ChatGet, ChatSet } from "@/store/chat-store-types";
import { previewFrom, upsertStep } from "@/store/chat-store-helpers";

// module-level on purpose: an abort controller must not trigger renders
let activeController: AbortController | null = null;

export function abortActiveStream() {
  activeController?.abort();
  activeController = null;
}

interface StreamOptions {
  conversationId: string;
  assistantId: string;
  history: ChatRequestMessage[];
  modelId: string;
  tools: ComposerToolId[];
  /** Incognito thread or history off: nothing may touch the disk. */
  ephemeral: boolean;
}

// single network path, shared by send and regenerate. Aborting the controller stops the upstream call, not just the display
export async function streamInto(
  set: ChatSet,
  get: ChatGet,
  { conversationId, assistantId, history, modelId, tools, ephemeral }: StreamOptions,
): Promise<void> {
  activeController = new AbortController();

  const patch = (updater: (message: Message) => Message) => {
    set((state) => {
      const thread = state.messages[conversationId] ?? [];
      return {
        messages: {
          ...state.messages,
          [conversationId]: thread.map((message) =>
            message.id === assistantId ? updater(message) : message,
          ),
        },
      };
    });
  };

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: activeController.signal,
      body: JSON.stringify({ messages: history, modelId, tools }),
    });

    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as { error?: string } | null;
      throw new Error(body?.error ?? `Le serveur a répondu ${response.status}`);
    }

    for await (const event of readSSE(response)) {
      switch (event.type) {
        case "reasoning":
          patch((message) => ({
            ...message,
            reasoning: upsertStep(message.reasoning, event.step),
          }));
          break;

        case "delta":
          patch((message) => ({ ...message, content: message.content + event.text }));
          break;

        case "usage":
          patch((message) => ({ ...message, usage: event.usage }));
          break;

        case "done":
          patch((message) => ({
            ...message,
            status: event.finishReason === "aborted" ? "stopped" : "complete",
          }));
          break;

        case "error":
          patch((message) => ({
            ...message,
            status: "error",
            error: { code: event.code, message: event.message },
          }));
          set({ error: event.message });
          break;
      }
    }
  } catch (error) {
    const aborted = error instanceof DOMException && error.name === "AbortError";
    if (aborted) {
      patch((message) => ({ ...message, status: "stopped" }));
    } else {
      const message = error instanceof Error ? error.message : "Erreur réseau";
      patch((current) => ({
        ...current,
        status: "error",
        error: { code: "network", message },
      }));
      set({ error: message });
    }
  } finally {
    activeController = null;
    set({ streamingMessageId: null });

    const final = ephemeral
      ? undefined
      : get().messages[conversationId]?.find((message) => message.id === assistantId);
    if (final) {
      // also rewrite fields emptied by a regeneration, or the old canvas and sources come back on reload
      await storage.patchMessage(final.id, {
        content: final.content,
        status: final.status,
        modelId: final.modelId,
        reasoning: final.reasoning,
        usage: final.usage,
        error: final.error,
        canvas: final.canvas,
        links: final.links,
        attachments: final.attachments,
      });

      const updated = get().conversations.find((item) => item.id === conversationId);
      if (updated) {
        await storage.upsertConversation({
          ...updated,
          preview: previewFrom(final.content || updated.preview),
          updatedAt: new Date().toISOString(),
          origin: "local",
        });
      }
    }
  }
}
