import { API_LIMITS } from "@/config/api";
import { LIMITS } from "@/config/limits";
import { getModel } from "@/config/models";
import { getAIClient } from "@/lib/ai/client";
import { toSSEResponse } from "@/lib/ai/stream";
import { readJsonBody } from "@/lib/api/body";
import { guardRequest } from "@/lib/api/guard";
import { checkEntitlements } from "@/lib/api/entitlements";
import { validateChatPayload } from "@/lib/api/validate";

// request.signal must reach the provider, or a client Stop leaves the
// upstream call running (and billed)

export const dynamic = "force-dynamic";
export const maxDuration = 300;

function errorResponse(message: string, status: number): Response {
  return Response.json({ error: message }, { status });
}

export async function POST(request: Request) {
  const denied = await guardRequest(request, "chat");
  if (denied) return denied;

  const body = await readJsonBody(request, API_LIMITS.maxBodyBytes);
  if (!body.ok) return errorResponse(body.error, body.status);

  const parsed = validateChatPayload(body.value, API_LIMITS);
  if (!parsed.ok) return errorResponse(parsed.error, 400);
  const payload = parsed.value;

  const model = getModel(payload.modelId);
  if (!model.available) {
    return errorResponse(`Le modèle « ${model.name} » n'est pas disponible.`, 400);
  }

  const forbidden = checkEntitlements(payload, LIMITS);
  if (forbidden) return errorResponse(forbidden, 403);

  const client = getAIClient();
  const events = client.streamChat({
    messages: payload.messages,
    modelId: model.id,
    tools: payload.tools,
    signal: request.signal,
  });

  return toSSEResponse(events, request.signal);
}
