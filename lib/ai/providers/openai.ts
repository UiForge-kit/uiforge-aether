import { getModel } from "@/config/models";
import { createId } from "@/lib/id";
import type { AIClient, ChatRequest, StreamEvent } from "@/types/ai";
import { assertOk, readUpstreamSSE } from "./upstream-sse";

// maps Chat Completions to `StreamEvent`.
// `stream_options.include_usage` is required, otherwise the last chunk carries no token count

const API_URL = "https://api.openai.com/v1/chat/completions";

const SYSTEM_PROMPT =
  "Tu es un assistant utile et concis. Réponds en français sauf demande contraire.";

interface OpenAIChunk {
  choices?: Array<{
    delta?: { content?: string | null };
    finish_reason?: string | null;
  }>;
  usage?: {
    prompt_tokens?: number;
    completion_tokens?: number;
    prompt_tokens_details?: { cached_tokens?: number };
  };
  error?: { code?: string; message?: string };
}

export const openaiClient: AIClient = {
  id: "openai",

  async *streamChat(request: ChatRequest): AsyncIterable<StreamEvent> {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      yield {
        type: "error",
        code: "missing_api_key",
        message: "OPENAI_API_KEY est absente de l'environnement.",
      };
      return;
    }

    const model = getModel(request.modelId);
    const messageId = createId("msg");
    yield { type: "start", messageId, modelId: model.id };

    const response = await fetch(API_URL, {
      method: "POST",
      signal: request.signal,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model.id,
        stream: true,
        stream_options: { include_usage: true },
        max_completion_tokens: model.maxOutput,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...request.messages
            .filter((message) => message.role !== "system")
            .map((message) => ({ role: message.role, content: message.content })),
        ],
      }),
    });

    await assertOk(response, "OpenAI");

    let input = 0;
    let output = 0;
    let cached = 0;
    let finishReason: string | null = null;

    for await (const raw of readUpstreamSSE(response)) {
      const chunk = raw as OpenAIChunk;

      if (chunk.error) {
        yield {
          type: "error",
          code: chunk.error.code ?? "openai_error",
          message: chunk.error.message ?? "Erreur du provider",
        };
        return;
      }

      const choice = chunk.choices?.[0];
      if (choice?.delta?.content) {
        yield { type: "delta", text: choice.delta.content };
      }
      if (choice?.finish_reason) {
        finishReason = choice.finish_reason;
      }

      if (chunk.usage) {
        input = chunk.usage.prompt_tokens ?? input;
        output = chunk.usage.completion_tokens ?? output;
        cached = chunk.usage.prompt_tokens_details?.cached_tokens ?? cached;
      }
    }

    yield {
      type: "usage",
      usage: { input, output, cached: cached || undefined, total: input + output },
    };
    yield { type: "done", finishReason: finishReason === "length" ? "length" : "stop" };
  },
};
