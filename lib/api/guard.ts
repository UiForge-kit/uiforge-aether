import { RATE_LIMITS, type RateLimitScope } from "@/config/api";
import { createRateLimiter } from "./rate-limit";

// in-memory counters, per instance: fine for one process, useless behind several replicas or serverless.
// swap for a shared store (Redis, KV) in production
const limiters = {
  chat: createRateLimiter(RATE_LIMITS.chat),
  read: createRateLimiter(RATE_LIMITS.read),
} satisfies Record<RateLimitScope, ReturnType<typeof createRateLimiter>>;

/**
 * Plug your session or API-key check here. Return a Response (401/403) to reject.
 * Allows everything by default, so the route is open until you implement it.
 */
export async function authorize(request: Request): Promise<Response | null> {
  void request;
  return null;
}

// first x-forwarded-for hop is client-controlled unless a proxy overwrites the header, don't trust it blindly
export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || request.headers.get("x-real-ip") || "unknown";
}

export async function guardRequest(request: Request, scope: RateLimitScope): Promise<Response | null> {
  const denied = await authorize(request);
  if (denied) return denied;

  const result = limiters[scope].check(clientIp(request));
  if (result.allowed) return null;

  return Response.json(
    { error: "Trop de requêtes. Réessayez dans un instant." },
    { status: 429, headers: { "Retry-After": String(result.retryAfterSeconds) } },
  );
}
