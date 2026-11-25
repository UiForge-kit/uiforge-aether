import type { PrismTheme } from "prism-react-renderer";

export const CODE_THEME: PrismTheme = {
  plain: { color: "var(--code-plain)" },
  styles: [
    {
      types: ["comment", "prolog", "doctype", "cdata"],
      style: { color: "var(--code-comment)", fontStyle: "italic" },
    },
    { types: ["punctuation"], style: { color: "var(--code-punctuation)" } },
    {
      types: ["property", "tag", "constant", "symbol", "deleted"],
      style: { color: "var(--code-tag)" },
    },
    { types: ["boolean", "number"], style: { color: "var(--code-number)" } },
    {
      types: ["selector", "attr-name", "string", "char", "builtin", "inserted"],
      style: { color: "var(--code-string)" },
    },
    {
      types: ["operator", "entity", "url", "variable"],
      style: { color: "var(--code-operator)" },
    },
    { types: ["atrule", "attr-value", "keyword"], style: { color: "var(--code-keyword)" } },
    { types: ["function", "class-name"], style: { color: "var(--code-function)" } },
    { types: ["regex", "important"], style: { color: "var(--code-regex)" } },
  ],
};

const ALIASES: Record<string, string> = {
  ts: "typescript",
  js: "javascript",
  sh: "bash",
  shell: "bash",
  yml: "yaml",
  md: "markdown",
  html: "markup",
  xml: "markup",
  text: "markup",
  txt: "markup",
};

export function prismLanguage(language: string): string {
  return ALIASES[language] ?? language;
}
