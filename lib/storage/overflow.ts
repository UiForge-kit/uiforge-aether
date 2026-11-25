import type { Conversation } from "../../types/chat.ts";

// ids to drop so at most `max` local conversations remain. oldest first; pinned are never dropped, bundled seeds don't count
export function selectOverflow(conversations: Conversation[], max: number): string[] {
  const local = conversations.filter((item) => item.origin === "local");
  const excess = local.length - max;
  if (excess <= 0) return [];

  return local
    .filter((item) => !item.pinned)
    .sort((a, b) => Date.parse(a.updatedAt) - Date.parse(b.updatedAt))
    .slice(0, excess)
    .map((item) => item.id);
}
