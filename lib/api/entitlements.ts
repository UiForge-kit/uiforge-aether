// server-side enforcement of the plan limits: the UI hides things, this is what actually protects the resource

import type { ChatRoutePayload } from "../../types/ai.ts";
import type { Limits } from "../../types/limits.ts";

export function isModelAllowed(modelId: string, limits: Limits): boolean {
  return limits.allowedModelIds === "all" || limits.allowedModelIds.includes(modelId);
}

export function isToolAllowed(toolId: string, limits: Limits): boolean {
  return limits.allowedToolIds === "all" || limits.allowedToolIds.includes(toolId);
}

export function checkEntitlements(payload: ChatRoutePayload, limits: Limits): string | null {
  if (!isModelAllowed(payload.modelId, limits)) {
    return "Ce modèle n'est pas inclus dans votre offre.";
  }

  const tool = payload.tools.find((id) => !isToolAllowed(id, limits));
  if (tool) return `L'outil « ${tool} » n'est pas inclus dans votre offre.`;

  if (payload.messages.length > limits.maxContextMessages) {
    return `Le contexte est limité à ${limits.maxContextMessages} messages.`;
  }

  const oversized = payload.messages.some(
    (message) => (message.attachments?.length ?? 0) > limits.maxAttachments,
  );
  if (oversized) return `Limité à ${limits.maxAttachments} pièces jointes par message.`;

  return null;
}
