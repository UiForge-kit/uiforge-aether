export type ProviderId = "mock" | "anthropic" | "openai";

/** Provider shown on the model card. Wider than `ProviderId`, which only covers providers wired in `lib/ai/client.ts`. */
export type ModelProviderId = "anthropic" | "openai" | "xai";

export interface ModelCapabilities {
  vision: boolean;
  tools: boolean;
  reasoning: boolean;
  webSearch: boolean;
}

export interface AIModel {
  id: string;
  provider: ModelProviderId;
  name: string;
  badge?: "new" | "fast" | "pro";
  contextWindow: number;
  maxOutput: number;
  capabilities: ModelCapabilities;
  pricing: { inputPerMTok: number; outputPerMTok: number };
  available: boolean;
}

export type ComposerToolId =
  | "attachments"
  | "web-search"
  | "extended-thinking"
  | "code-interpreter"
  | "canvas";

export interface ComposerTool {
  id: ComposerToolId;
  label: string;
  description: string;
  kind: "toggle" | "action";
  defaultEnabled: boolean;
  requires?: keyof ModelCapabilities;
}
