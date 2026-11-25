import { guardRequest } from "@/lib/api/guard";
import { createSeedConversations, createSeedMessages } from "@/lib/mock/conversations";

// seed data for the sidebar, the client keeps its own conversations locally
// TODO: read from the database

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const denied = await guardRequest(request, "read");
  if (denied) return denied;

  return Response.json({
    conversations: createSeedConversations(),
    messages: createSeedMessages(),
  });
}
