import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { ChatRoutePayload } from "../../types/ai.ts";
import type { Limits } from "../../types/limits.ts";
import { checkEntitlements, isModelAllowed, isToolAllowed } from "./entitlements.ts";

const limits: Limits = {
  maxAttachments: 2,
  maxContextMessages: 3,
  maxConversations: 10,
  allowedModelIds: ["m1"],
  allowedToolIds: ["canvas"],
};

const attachment = { id: "a", name: "a", mimeType: "text/plain", size: 1, kind: "file", url: "" };

function payload(overrides: Partial<ChatRoutePayload> = {}): ChatRoutePayload {
  return {
    messages: [{ role: "user", content: "hi" }],
    modelId: "m1",
    tools: [],
    ...overrides,
  };
}

describe("entitlements", () => {
  it("accepts a payload within limits", () => {
    assert.equal(checkEntitlements(payload({ tools: ["canvas"] }), limits), null);
  });

  it("rejects a model outside the allow list", () => {
    assert.match(checkEntitlements(payload({ modelId: "m2" }), limits) ?? "", /modèle/);
  });

  it("rejects a tool outside the allow list", () => {
    assert.match(checkEntitlements(payload({ tools: ["web-search"] }), limits) ?? "", /web-search/);
  });

  it("rejects too many context messages", () => {
    const messages = Array.from({ length: 4 }, () => ({ role: "user" as const, content: "x" }));
    assert.match(checkEntitlements(payload({ messages }), limits) ?? "", /3 messages/);
  });

  it("rejects too many attachments on one message", () => {
    const attachments = [attachment, attachment, attachment] as never;
    const messages = [{ role: "user" as const, content: "x", attachments }];
    assert.match(checkEntitlements(payload({ messages }), limits) ?? "", /2 pièces jointes/);
  });

  it('treats "all" as unrestricted', () => {
    const open: Limits = { ...limits, allowedModelIds: "all", allowedToolIds: "all" };
    assert.equal(isModelAllowed("anything", open), true);
    assert.equal(isToolAllowed("anything", open), true);
    assert.equal(isToolAllowed("anything", limits), false);
  });
});
