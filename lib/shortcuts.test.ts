import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { matchesShortcut } from "./shortcuts.ts";

const press = (key: string, extra: Partial<Record<"shiftKey" | "metaKey" | "ctrlKey", boolean>> = {}) => ({
  key,
  shiftKey: false,
  metaKey: false,
  ctrlKey: true,
  ...extra,
});

describe("matchesShortcut", () => {
  it("matches mod + shift + letter, whatever the case", () => {
    assert.equal(matchesShortcut(press("N", { shiftKey: true }), ["mod", "⇧", "N"]), true);
    assert.equal(matchesShortcut(press("n", { shiftKey: true, ctrlKey: false, metaKey: true }), ["mod", "⇧", "N"]), true);
  });

  it("requires the shift state to match", () => {
    assert.equal(matchesShortcut(press("n"), ["mod", "⇧", "N"]), false);
    assert.equal(matchesShortcut(press("k", { shiftKey: true }), ["mod", "K"]), false);
  });

  it("ignores events without mod", () => {
    assert.equal(matchesShortcut(press("k", { ctrlKey: false }), ["mod", "K"]), false);
  });

  it("rejects a list that has no final key", () => {
    assert.equal(matchesShortcut(press("k"), ["mod"]), false);
  });
});
