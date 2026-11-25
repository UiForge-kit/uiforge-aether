// Limits applied by lib/api/guard.ts and the chat payload validation.

function positiveInt(raw: string | undefined, fallback: number): number {
  const value = Number(raw);
  return Number.isInteger(value) && value > 0 ? value : fallback;
}

export const API_LIMITS = {
  maxBodyBytes: 256 * 1024,
  maxMessages: 100,
  maxMessageChars: 32_000,
  maxAttachmentsPerMessage: 10,
  maxTools: 16,
} as const;

const windowMs = positiveInt(process.env.API_RATE_LIMIT_WINDOW_SECONDS, 60) * 1000;

export const RATE_LIMITS = {
  chat: { windowMs, max: positiveInt(process.env.API_RATE_LIMIT_MAX, 20) },
  read: { windowMs, max: 120 },
} as const;

export type RateLimitScope = keyof typeof RATE_LIMITS;
