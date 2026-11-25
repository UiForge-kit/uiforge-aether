"use client";

import { useState } from "react";
import {
  Copy01Icon,
  Download04Icon,
  Note01Icon,
  SourceCodeIcon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { Markdown } from "@/components/chat/markdown";
import { CodeBlock } from "@/components/code/code-block";
import { Icon } from "@/components/icon";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCopy } from "@/hooks/use-copy";
import { downloadCanvasDocument, languageLabel, lineCount } from "@/lib/canvas";
import { useCanvasStore } from "@/store/canvas-store";
import type { CanvasDocument } from "@/types/chat";

// mounted once at provider level, only one document is open at a time
export function CanvasDialog() {
  const { document, open, setOpen } = useCanvasStore();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        showCloseButton={false}
        className="flex max-h-[85vh] w-full flex-col gap-0 overflow-hidden p-0 sm:max-w-3xl"
      >
        {document && <CanvasBody document={document} onClose={() => setOpen(false)} />}
      </DialogContent>
    </Dialog>
  );
}

function CanvasBody({
  document,
  onClose,
}: {
  document: CanvasDocument;
  onClose: () => void;
}) {
  const { copied, copy } = useCopy();

  return (
    <>
      <header className="border-border flex shrink-0 items-center gap-2.5 border-b px-4 py-3">
        <span className="bg-muted text-foreground grid size-8 shrink-0 place-items-center rounded-lg">
          <Icon icon={document.kind === "code" ? SourceCodeIcon : Note01Icon} size={15} />
        </span>

        <div className="min-w-0 flex-1">
          <DialogTitle className="truncate text-sm">{document.title}</DialogTitle>
          <p className="text-muted-foreground text-xs">
            {languageLabel(document.language)} · {lineCount(document.content)} lignes
          </p>
        </div>

        <Button size="sm" variant="outline" onClick={() => void copy(document.content)}>
          <Icon icon={copied ? Tick02Icon : Copy01Icon} size={14} />
          {copied ? "Copié" : "Copier"}
        </Button>
        <Button size="sm" variant="outline" onClick={() => downloadCanvasDocument(document)}>
          <Icon icon={Download04Icon} size={14} />
          Télécharger
        </Button>
        <Button size="sm" variant="ghost" onClick={onClose}>
          Fermer
        </Button>
      </header>

      {document.kind === "markdown" ? (
        <MarkdownBody content={document.content} />
      ) : (
        <CodeBody content={document.content} language={document.language} />
      )}
    </>
  );
}

function CodeBody({ content, language }: { content: string; language: string }) {
  return (
    <div className="scrollbar-slim min-h-0 flex-1 overflow-auto p-3">
      <CodeBlock code={content} language={language} />
    </div>
  );
}

function MarkdownBody({ content }: { content: string }) {
  const [tab, setTab] = useState("preview");

  return (
    <Tabs value={tab} onValueChange={(value) => setTab(String(value))} className="min-h-0 flex-1 gap-0">
      <TabsList variant="line" className="border-border shrink-0 rounded-none border-b px-3">
        <TabsTrigger value="preview">Aperçu</TabsTrigger>
        <TabsTrigger value="source">Source</TabsTrigger>
      </TabsList>

      <TabsContent value="preview" className="scrollbar-slim min-h-0 overflow-auto p-5">
        <Markdown content={content} />
      </TabsContent>

      <TabsContent value="source" className="scrollbar-slim min-h-0 overflow-auto">
        <pre className="p-4 font-mono text-[0.8125rem] leading-relaxed whitespace-pre-wrap">
          <code>{content}</code>
        </pre>
      </TabsContent>
    </Tabs>
  );
}
