import type { ChatRoutePayload } from "../../types/ai.ts";

export interface ChatLimits {
  maxMessages: number;
  maxMessageChars: number;
  maxAttachmentsPerMessage: number;
  maxTools: number;
}

export type ValidationResult =
  | { ok: true; value: ChatRoutePayload }
  | { ok: false; error: string };

const ROLES = new Set(["user", "assistant", "system"]);

const fail = (error: string): ValidationResult => ({ ok: false, error });
const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

export function validateChatPayload(input: unknown, limits: ChatLimits): ValidationResult {
  if (!isRecord(input)) return fail("Le corps doit être un objet JSON.");

  const { messages, modelId, tools = [] } = input;

  if (!Array.isArray(messages) || messages.length === 0) {
    return fail("Le champ `messages` est requis et ne peut pas être vide.");
  }
  if (messages.length > limits.maxMessages) {
    return fail(`Trop de messages (${limits.maxMessages} maximum).`);
  }

  for (const [i, message] of messages.entries()) {
    if (!isRecord(message) || typeof message.role !== "string" || !ROLES.has(message.role)) {
      return fail(`Message ${i} : rôle invalide.`);
    }
    if (typeof message.content !== "string") return fail(`Message ${i} : contenu invalide.`);
    if (message.content.length > limits.maxMessageChars) {
      return fail(`Message ${i} : ${limits.maxMessageChars} caractères maximum.`);
    }
    const { attachments } = message;
    if (attachments !== undefined) {
      if (!Array.isArray(attachments) || attachments.length > limits.maxAttachmentsPerMessage) {
        return fail(`Message ${i} : pièces jointes invalides.`);
      }
      if (!attachments.every(isRecord)) return fail(`Message ${i} : pièces jointes invalides.`);
    }
  }

  if (typeof modelId !== "string" || modelId.length === 0 || modelId.length > 100) {
    return fail("Le champ `modelId` est requis.");
  }
  if (
    !Array.isArray(tools) ||
    tools.length > limits.maxTools ||
    !tools.every((t) => typeof t === "string" && t.length > 0 && t.length <= 64)
  ) {
    return fail("Le champ `tools` doit être une liste d'identifiants.");
  }

  return { ok: true, value: { messages, modelId, tools } as ChatRoutePayload };
}
