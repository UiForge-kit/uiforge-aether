import { getModel } from "@/config/models";
import { createId } from "@/lib/id";
import type { AIClient, ChatRequest, StreamEvent } from "@/types/ai";
import { assertOk, readUpstreamSSE } from "./upstream-sse";

// maps the Messages API to `StreamEvent`. plain fetch, to keep provider SDKs out of the template

const API_URL = "https://api.anthropic.com/v1/messages";
const API_VERSION = "2023-06-01";

const SYSTEM_PROMPT =
  "Tu es un assistant utile et concis. Réponds en français sauf demande contraire.";

interface AnthropicEvent {
  type: string;
  delta?: {
    type?: string;
    text?: string;
    thinking?: string;
    stop_reason?: string | null;
  };
  content_block?: { type?: string };
  message?: { usage?: { input_tokens?: number; output_tokens?: number } };
  usage?: { input_tokens?: number; output_tokens?: number; cache_read_input_tokens?: number };
  error?: { type?: string; message?: string };
}

export const anthropicClient: AIClient = {
  id: "anthropic",

  async *streamChat(request: ChatRequest): AsyncIterable<StreamEvent> {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      yield {
        type: "error",
        code: "missing_api_key",
        message: "ANTHROPIC_API_KEY est absente de l'environnement.",
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
        "x-api-key": apiKey,
        "anthropic-version": API_VERSION,
      },
      body: JSON.stringify({
        model: model.id,
        max_tokens: model.maxOutput,
        stream: true,
        system: SYSTEM_PROMPT,
        messages: request.messages
          .filter((message) => message.role !== "system")
          .map((message) => ({ role: message.role, content: message.content })),
        // attachments go as `image` / `document` blocks
        // https://docs.anthropic.com/en/docs/build-with-claude/vision
        ...(request.tools.includes("extended-thinking") && model.capabilities.reasoning
          ? { thinking: { type: "enabled", budget_tokens: 8_000 } }
          : {}),
      }),
    });

    await assertOk(response, "Anthropic");

    let input = 0;
    let output = 0;
    let cached = 0;
    let thinkingStep: string | null = null;

    for await (const raw of readUpstreamSSE(response)) {
      const event = raw as AnthropicEvent;

      switch (event.type) {
        case "message_start":
          input = event.message?.usage?.input_tokens ?? 0;
          break;

        case "content_block_start":
          if (event.content_block?.type === "thinking") {
            thinkingStep = createId("step");
            yield {
              type: "reasoning",
              step: {
                id: thinkingStep,
                kind: "thinking",
                label: "Réflexion en cours",
                status: "running",
              },
            };
          }
          break;

        case "content_block_delta":
          if (event.delta?.type === "text_delta" && event.delta.text) {
            yield { type: "delta", text: event.delta.text };
          }
          break;

        case "content_block_stop":
          if (thinkingStep) {
            yield {
              type: "reasoning",
              step: {
                id: thinkingStep,
                kind: "thinking",
                label: "Réflexion terminée",
                status: "done",
              },
            };
            thinkingStep = null;
          }
          break;

        case "message_delta":
          output = event.usage?.output_tokens ?? output;
          cached = event.usage?.cache_read_input_tokens ?? cached;
          break;

        case "error":
          yield {
            type: "error",
            code: event.error?.type ?? "anthropic_error",
            message: event.error?.message ?? "Erreur du provider",
          };
          return;

        case "message_stop":
          yield {
            type: "usage",
            usage: { input, output, cached: cached || undefined, total: input + output },
          };
          yield { type: "done", finishReason: "stop" };
          return;
      }
    }

    yield { type: "done", finishReason: "stop" };
  },
};
