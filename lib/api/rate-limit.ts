export interface RateLimitOptions {
  windowMs: number;
  max: number;
}

export type RateLimitResult =
  | { allowed: true }
  | { allowed: false; retryAfterSeconds: number };

const MAX_TRACKED_KEYS = 10_000;

// sliding window log: one timestamp per accepted request, per key. Per instance only, see guard.ts
export function createRateLimiter({ windowMs, max }: RateLimitOptions) {
  const hits = new Map<string, number[]>();

  function prune(now: number) {
    for (const [key, stamps] of hits) {
      if (stamps[stamps.length - 1] <= now - windowMs) hits.delete(key);
    }
  }

  return {
    check(key: string, now = Date.now()): RateLimitResult {
      // stops the map from growing without bound under many distinct keys
      if (hits.size >= MAX_TRACKED_KEYS) prune(now);

      const stamps = (hits.get(key) ?? []).filter((t) => t > now - windowMs);
      if (stamps.length >= max) {
        hits.set(key, stamps);
        return { allowed: false, retryAfterSeconds: Math.max(1, Math.ceil((stamps[0] + windowMs - now) / 1000)) };
      }
      stamps.push(now);
      hits.set(key, stamps);
      return { allowed: true };
    },
  };
}
