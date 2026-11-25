import type { AIClient } from "@/types/ai";
import type { ProviderId } from "@/types/model";
import { anthropicClient } from "./providers/anthropic";
import { mockClient } from "./providers/mock";
import { openaiClient } from "./providers/openai";

// provider registry. server-side only so no key crosses to the client. providers all emit the same `StreamEvent`s

const REGISTRY: Record<ProviderId, AIClient> = {
  mock: mockClient,
  anthropic: anthropicClient,
  openai: openaiClient,
};

function resolveProviderId(): ProviderId {
  const configured = process.env.AI_PROVIDER as ProviderId | undefined;
  if (configured && configured in REGISTRY) return configured;

  // outside production a key is enough to enable its provider, even without AI_PROVIDER
  if (process.env.ANTHROPIC_API_KEY) return "anthropic";
  if (process.env.OPENAI_API_KEY) return "openai";
  return "mock";
}

export function getAIClient(): AIClient {
  return REGISTRY[resolveProviderId()];
}

export function isMockMode(): boolean {
  return resolveProviderId() === "mock";
}
