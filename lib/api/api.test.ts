import assert from "node:assert/strict";
import { test } from "node:test";
import { readJsonBody } from "./body.ts";
import { createRateLimiter } from "./rate-limit.ts";
import { validateChatPayload } from "./validate.ts";

const limits = { maxMessages: 3, maxMessageChars: 10, maxAttachmentsPerMessage: 1, maxTools: 2 };
const msg = { role: "user", content: "hi" };
const valid = { messages: [msg], modelId: "m", tools: [] };

test("rate limiter blocks after max and reports Retry-After", () => {
  const limiter = createRateLimiter({ windowMs: 10_000, max: 2 });
  assert.equal(limiter.check("a", 0).allowed, true);
  assert.equal(limiter.check("a", 1000).allowed, true);
  const blocked = limiter.check("a", 4000);
  assert.deepEqual(blocked, { allowed: false, retryAfterSeconds: 6 });
  assert.equal(limiter.check("b", 4000).allowed, true);
});

test("rate limiter window slides", () => {
  const limiter = createRateLimiter({ windowMs: 10_000, max: 1 });
  limiter.check("a", 0);
  assert.equal(limiter.check("a", 9_999).allowed, false);
  assert.equal(limiter.check("a", 10_001).allowed, true);
});

test("validate accepts a well-formed payload and defaults tools", () => {
  assert.equal(validateChatPayload(valid, limits).ok, true);
  assert.equal(validateChatPayload({ messages: [msg], modelId: "m" }, limits).ok, true);
});

test("validate rejects bad shapes and bounds", () => {
  const bad = (p: unknown) => validateChatPayload(p, limits).ok === false;
  assert.ok(bad(null));
  assert.ok(bad([]));
  assert.ok(bad({ ...valid, messages: [] }));
  assert.ok(bad({ ...valid, messages: [msg, msg, msg, msg] }));
  assert.ok(bad({ ...valid, messages: [{ role: "bot", content: "x" }] }));
  assert.ok(bad({ ...valid, messages: [{ role: "user", content: 1 }] }));
  assert.ok(bad({ ...valid, messages: [{ role: "user", content: "x".repeat(11) }] }));
  assert.ok(bad({ ...valid, messages: [{ ...msg, attachments: [1] }] }));
  assert.ok(bad({ ...valid, messages: [{ ...msg, attachments: [{}, {}] }] }));
  assert.ok(bad({ ...valid, modelId: 3 }));
  assert.ok(bad({ ...valid, tools: "web-search" }));
  assert.ok(bad({ ...valid, tools: ["a", "b", "c"] }));
  assert.ok(bad({ ...valid, tools: [1] }));
});

const post = (body: string, headers: HeadersInit = {}) =>
  new Request("http://x/api", { method: "POST", body, headers });

test("readJsonBody parses, rejects invalid JSON and oversize bodies", async () => {
  assert.deepEqual(await readJsonBody(post('{"a":1}'), 100), { ok: true, value: { a: 1 } });
  const invalid = await readJsonBody(post("{nope"), 100);
  assert.ok(!invalid.ok && invalid.status === 400);
  const big = await readJsonBody(post("x".repeat(200)), 100);
  assert.ok(!big.ok && big.status === 413);
});
