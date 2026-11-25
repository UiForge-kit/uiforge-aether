import type { Limits } from "@/types/limits";

// read these values, never test for a plan. anything that protects a resource (models, tools, sizes)
// is also enforced server-side in `app/api/chat`
export const LIMITS: Limits = {
  maxAttachments: 3,
  maxContextMessages: 10,
  maxConversations: 30,
  allowedModelIds: ["claude-sonnet-4-6", "gpt-5.2"],
  allowedToolIds: ["attachments", "canvas"],
};
