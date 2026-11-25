import { LIMITS } from "@/config/limits";
import { storage } from "@/lib/storage";
import type { ChatRequestMessage } from "@/types/ai";
import type { Conversation, Message, ReasoningStep } from "@/types/chat";

export function titleFrom(content: string): string {
  const clean = content.replace(/\s+/g, " ").trim();
  return clean.length > 52 ? `${clean.slice(0, 52)}…` : clean || "Nouvelle conversation";
}

export function previewFrom(content: string): string {
  return content.replace(/[*_`#\n]/g, " ").replace(/\s+/g, " ").slice(0, 120).trim();
}

export function upsertStep(steps: ReasoningStep[] | undefined, step: ReasoningStep): ReasoningStep[] {
  const current = steps ?? [];
  const index = current.findIndex((item) => item.id === step.id);
  if (index < 0) return [...current, step];
  const next = [...current];
  next[index] = step;
  return next;
}

export function toHistory(thread: Message[]): ChatRequestMessage[] {
  return thread
    .filter((message) => message.role !== "system" && message.status !== "error")
    .slice(-LIMITS.maxContextMessages)
    .map((message) => ({
      role: message.role,
      content: message.content,
      attachments: message.attachments,
    }));
}

export async function adoptThread(conversation: Conversation, thread: Message[]): Promise<void> {
  await storage.upsertConversation({ ...conversation, origin: "local" });
  if (thread.length > 0 && (await storage.getMessages(conversation.id)).length === 0) {
    for (const message of thread) await storage.appendMessage(message);
  }
}
