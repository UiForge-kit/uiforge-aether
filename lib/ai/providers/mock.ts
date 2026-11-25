import { getModel } from "@/config/models";
import { createId } from "@/lib/id";
import { pickReply } from "@/lib/mock/replies";
import type { AIClient, ChatRequest, StreamEvent } from "@/types/ai";

// replays a canned reply at real-model pace, split by word like real providers (not by character)

const FIRST_TOKEN_DELAY_MS = 380;
const CHUNK_DELAY_MS = 22;
const WORDS_PER_CHUNK = 3;

function sleep(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) return reject(new DOMException("Aborted", "AbortError"));
    const timer = setTimeout(resolve, ms);
    signal?.addEventListener(
      "abort",
      () => {
        clearTimeout(timer);
        reject(new DOMException("Aborted", "AbortError"));
      },
      { once: true },
    );
  });
}

function toChunks(text: string): string[] {
  const pieces = text.match(/\S+\s*/g) ?? [text];
  const chunks: string[] = [];
  for (let index = 0; index < pieces.length; index += WORDS_PER_CHUNK) {
    chunks.push(pieces.slice(index, index + WORDS_PER_CHUNK).join(""));
  }
  return chunks;
}

function estimateTokens(text: string): number {
  return Math.max(1, Math.round(text.length / 3.8));
}

export const mockClient: AIClient = {
  id: "mock",

  async *streamChat(request: ChatRequest): AsyncIterable<StreamEvent> {
    const { signal } = request;
    const lastUserMessage =
      [...request.messages].reverse().find((message) => message.role === "user")?.content ?? "";

    const reply = pickReply(lastUserMessage);
    const model = getModel(request.modelId);
    const messageId = createId("msg");

    try {
      yield { type: "start", messageId, modelId: model.id };
      await sleep(FIRST_TOKEN_DELAY_MS, signal);

      const steps = reply.reasoning ?? [];
      const wantsThinking = request.tools.includes("extended-thinking");
      const wantsSearch = request.tools.includes("web-search");

      for (const step of steps) {
        if (step.kind === "search" && !wantsSearch && !model.capabilities.webSearch) continue;
        yield { type: "reasoning", step: { ...step, status: "running" } };
        await sleep(wantsThinking ? 520 : 260, signal);
        yield { type: "reasoning", step: { ...step, status: "done" } };
      }

      for (const chunk of toChunks(reply.content)) {
        yield { type: "delta", text: chunk };
        await sleep(CHUNK_DELAY_MS, signal);
      }

      const input = request.messages.reduce(
        (sum, message) => sum + estimateTokens(message.content),
        0,
      );
      const output = estimateTokens(reply.content);

      yield { type: "usage", usage: { input, output, total: input + output } };
      yield { type: "done", finishReason: "stop" };
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        yield { type: "done", finishReason: "aborted" };
        return;
      }
      throw error;
    }
  },
};
