import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { Conversation } from "../../types/chat.ts";
import { selectOverflow } from "./overflow.ts";

function conversation(id: string, day: number, extra: Partial<Conversation> = {}): Conversation {
  const at = `2026-01-${String(day).padStart(2, "0")}T10:00:00.000Z`;
  return {
    id,
    title: id,
    preview: "",
    createdAt: at,
    updatedAt: at,
    modelId: "m",
    messageCount: 0,
    pinned: false,
    archived: false,
    origin: "local",
    ...extra,
  };
}

describe("selectOverflow", () => {
  it("returns nothing under the limit", () => {
    assert.deepEqual(selectOverflow([conversation("a", 1), conversation("b", 2)], 2), []);
  });

  it("drops the oldest local conversations first", () => {
    const list = [conversation("new", 5), conversation("old", 1), conversation("mid", 3)];
    assert.deepEqual(selectOverflow(list, 2), ["old"]);
  });

  it("keeps pinned and seed conversations", () => {
    const list = [
      conversation("pinned", 1, { pinned: true }),
      conversation("seed", 2, { origin: "seed" }),
      conversation("a", 3),
      conversation("b", 4),
    ];
    assert.deepEqual(selectOverflow(list, 2), ["a"]);
  });
});
