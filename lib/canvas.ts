import { slugify } from "@/lib/utils";
import type { CanvasDocument } from "@/types/chat";

const LANGUAGE_META: Record<string, { label: string; extension: string }> = {
  markdown: { label: "Markdown", extension: "md" },
  typescript: { label: "TypeScript", extension: "ts" },
  tsx: { label: "TSX", extension: "tsx" },
  javascript: { label: "JavaScript", extension: "js" },
  python: { label: "Python", extension: "py" },
  sql: { label: "SQL", extension: "sql" },
  bash: { label: "Bash", extension: "sh" },
  json: { label: "JSON", extension: "json" },
  yaml: { label: "YAML", extension: "yml" },
  css: { label: "CSS", extension: "css" },
  html: { label: "HTML", extension: "html" },
  text: { label: "Texte", extension: "txt" },
};

export function languageLabel(language: string): string {
  return LANGUAGE_META[language]?.label ?? language;
}

export function canvasFileName(document: CanvasDocument): string {
  const extension = LANGUAGE_META[document.language]?.extension ?? "txt";
  return `${slugify(document.title)}.${extension}`;
}

export function lineCount(content: string): number {
  return content.replace(/\n$/, "").split("\n").length;
}

export function downloadCanvasDocument(document: CanvasDocument): void {
  const blob = new Blob([document.content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = window.document.createElement("a");
  link.href = url;
  link.download = canvasFileName(document);
  link.click();
  URL.revokeObjectURL(url);
}
