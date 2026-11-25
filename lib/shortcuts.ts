export interface KeyEventLike {
  key: string;
  shiftKey: boolean;
  metaKey: boolean;
  ctrlKey: boolean;
}

/** Matches a `config/shortcuts.ts` key list ("mod", optional "⇧", then the key) against a keydown. */
export function matchesShortcut(event: KeyEventLike, keys: readonly string[]): boolean {
  if (!(event.metaKey || event.ctrlKey)) return false;

  const key = keys[keys.length - 1];
  if (!key || key === "mod" || key === "⇧") return false;

  return keys.includes("⇧") === event.shiftKey && event.key.toLowerCase() === key.toLowerCase();
}
