import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { describe, it } from "node:test";

const root = new URL("../", import.meta.url);
const registry = readFileSync(new URL("config/modules.ts", root), "utf8");

const ids = [...registry.matchAll(/from "@\/modules\/([\w-]+)"/g)].map((match) => match[1]);

describe("module registry", () => {
  it("lists modules", () => {
    assert.ok(ids.length > 0);
  });

  for (const id of ids) {
    it(`${id} has an entry point`, () => {
      assert.ok(existsSync(new URL(`modules/${id}/index.tsx`, root)));
    });
  }
});
