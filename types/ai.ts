import type { Attachment, Message, ReasoningStep, Role, TokenUsage } from "./chat";
import type { ComposerToolId } from "./model";

/** Common vocabulary for every provider. Six events, keep it that way. */
export type StreamEvent =
  | { type: "start"; messageId: string; modelId: string }
  | { type: "reasoning"; step: ReasoningStep }
  | { type: "delta"; text: string }
  | { type: "usage"; usage: TokenUsage }
  | { type: "done"; finishReason: FinishReason }
  | { type: "error"; code: string; message: string };

export type FinishReason = "stop" | "length" | "aborted" | "error";

export interface ChatRequestMessage {
  role: Role;
  content: string;
  attachments?: Attachment[];
}

export interface ChatRequest {
  messages: ChatRequestMessage[];
  modelId: string;
  tools: ComposerToolId[];
  signal?: AbortSignal;
}

export interface AIClient {
  readonly id: string;
  streamChat(request: ChatRequest): AsyncIterable<StreamEvent>;
}

export interface ChatRoutePayload {
  messages: ChatRequestMessage[];
  modelId: string;
  tools: ComposerToolId[];
}

export type MessageDraft = Pick<Message, "role" | "content" | "attachments">;
