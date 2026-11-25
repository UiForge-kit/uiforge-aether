"use client";

import { Note01Icon, SourceCodeIcon } from "@hugeicons/core-free-icons";
import { Icon } from "@/components/icon";
import { languageLabel, lineCount } from "@/lib/canvas";
import { useCanvasStore } from "@/store/canvas-store";
import type { CanvasDocument } from "@/types/chat";

export function CanvasCard({ document }: { document: CanvasDocument }) {
  const show = useCanvasStore((state) => state.show);

  return (
    <button
      type="button"
      onClick={() => show(document)}
      className="border-border bg-surface hover:border-border-strong group my-2 flex w-full max-w-sm items-center gap-3 rounded-xl border p-3 text-left transition-colors"
    >
      <span className="bg-muted text-foreground grid size-9 shrink-0 place-items-center rounded-lg">
        <Icon icon={document.kind === "code" ? SourceCodeIcon : Note01Icon} size={16} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[0.8125rem] font-medium">{document.title}</span>
        <span className="text-muted-foreground block truncate text-xs">
          {languageLabel(document.language)} · {lineCount(document.content)} lignes
        </span>
      </span>
      <span className="text-muted-foreground group-hover:text-foreground shrink-0 text-xs transition-colors">
        Ouvrir
      </span>
    </button>
  );
}
