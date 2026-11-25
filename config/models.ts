import type { AIModel } from "@/types/model";

// `id`s are the real provider ids and go to the API as is
export const MODELS: AIModel[] = [
  {
    id: "claude-sonnet-4-6",
    provider: "anthropic",
    name: "Sonnet 4.6",
    badge: "new",
    contextWindow: 200_000,
    maxOutput: 64_000,
    capabilities: { vision: true, tools: true, reasoning: true, webSearch: true },
    pricing: { inputPerMTok: 3, outputPerMTok: 15 },
    available: true,
  },
  {
    id: "claude-opus-4-6",
    provider: "anthropic",
    name: "Opus 4.6",
    badge: "pro",
    contextWindow: 200_000,
    maxOutput: 64_000,
    capabilities: { vision: true, tools: true, reasoning: true, webSearch: true },
    pricing: { inputPerMTok: 15, outputPerMTok: 75 },
    available: true,
  },
  {
    id: "claude-fable-5-1",
    provider: "anthropic",
    name: "Fable 5.1",
    badge: "new",
    contextWindow: 200_000,
    maxOutput: 64_000,
    capabilities: { vision: true, tools: true, reasoning: true, webSearch: true },
    pricing: { inputPerMTok: 4, outputPerMTok: 18 },
    available: true,
  },
  {
    id: "gpt-terra",
    provider: "openai",
    name: "GPT Terra",
    badge: "new",
    contextWindow: 400_000,
    maxOutput: 128_000,
    capabilities: { vision: true, tools: true, reasoning: true, webSearch: true },
    pricing: { inputPerMTok: 3, outputPerMTok: 12 },
    available: true,
  },
  {
    id: "gpt-5.2",
    provider: "openai",
    name: "GPT-5.2",
    contextWindow: 400_000,
    maxOutput: 128_000,
    capabilities: { vision: true, tools: true, reasoning: true, webSearch: true },
    pricing: { inputPerMTok: 2.5, outputPerMTok: 10 },
    available: true,
  },
  {
    id: "gpt-5.2-mini",
    provider: "openai",
    name: "GPT-5.2 mini",
    badge: "fast",
    contextWindow: 400_000,
    maxOutput: 64_000,
    capabilities: { vision: true, tools: true, reasoning: false, webSearch: false },
    pricing: { inputPerMTok: 0.4, outputPerMTok: 1.6 },
    available: false,
  },
  {
    id: "grok-5",
    provider: "xai",
    name: "Grok 5",
    badge: "new",
    contextWindow: 256_000,
    maxOutput: 64_000,
    capabilities: { vision: true, tools: true, reasoning: true, webSearch: true },
    pricing: { inputPerMTok: 3, outputPerMTok: 12 },
    available: true,
  },
];

export const DEFAULT_MODEL_ID = MODELS[0].id;

export function getModel(id: string): AIModel {
  return MODELS.find((model) => model.id === id) ?? MODELS[0];
}
