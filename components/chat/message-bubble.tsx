"use client";

import { Alert02Icon } from "@hugeicons/core-free-icons";
import { motion } from "motion/react";
import { AttachmentChip } from "@/components/chat/attachment-chip";
import { CanvasCard } from "@/components/canvas/canvas-card";
import { LinkPreviewCard } from "@/components/chat/link-preview-card";
import { Markdown } from "@/components/chat/markdown";
import { MessageActions } from "@/components/chat/message-actions";
import { ReasoningTrail } from "@/components/chat/reasoning-trail";
import { BrandMark } from "@/components/brand-mark";
import { Icon } from "@/components/icon";
import type { Message } from "@/types/chat";

export function MessageBubble({ message }: { message: Message }) {
  if (message.role === "user") return <UserMessage message={message} />;
  return <AssistantMessage message={message} />;
}

function UserMessage({ message }: { message: Message }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="flex flex-col items-end gap-1.5 py-3"
    >
      {message.attachments && message.attachments.length > 0 && (
        <div className="flex max-w-[85%] flex-wrap justify-end gap-1.5">
          {message.attachments.map((attachment) => (
            <AttachmentChip key={attachment.id} attachment={attachment} />
          ))}
        </div>
      )}

      <div className="bg-secondary text-secondary-foreground max-w-[85%] rounded-2xl px-4 py-2.5 text-[0.9375rem] leading-relaxed whitespace-pre-wrap">
        {message.content}
      </div>

      {message.links && message.links.length > 0 && (
        <div className="grid w-full max-w-[85%] gap-2 sm:max-w-md">
          {message.links.map((link) => (
            <LinkPreviewCard key={link.id} link={link} />
          ))}
        </div>
      )}
    </motion.div>
  );
}

function AssistantMessage({ message }: { message: Message }) {
  const streaming = message.status === "streaming";

  return (
    <div className="group/message flex gap-3 py-3">
      <BrandMark className="mt-0.5 size-7 rounded-lg" />

      <div className="min-w-0 flex-1">
        {message.reasoning && message.reasoning.length > 0 && (
          <ReasoningTrail steps={message.reasoning} />
        )}

        {message.status === "error" ? (
          <div className="border-destructive/25 bg-destructive/5 text-destructive flex items-start gap-2 rounded-lg border p-3 text-[0.875rem]">
            <Icon icon={Alert02Icon} size={16} className="mt-0.5" />
            <span>
              {message.error?.message ?? "La réponse n'a pas pu être générée."}
              {message.content && (
                <span className="text-foreground mt-2 block whitespace-pre-wrap">
                  {message.content}
                </span>
              )}
            </span>
          </div>
        ) : (
          <>
            <Markdown content={message.content} />

            {message.canvas && message.canvas.length > 0 && (
              <div className="flex flex-col">
                {message.canvas.map((document) => (
                  <CanvasCard key={document.id} document={document} />
                ))}
              </div>
            )}

            {message.links && message.links.length > 0 && (
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {message.links.map((link) => (
                  <LinkPreviewCard key={link.id} link={link} />
                ))}
              </div>
            )}

            {message.attachments && message.attachments.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {message.attachments.map((attachment) => (
                  <AttachmentChip key={attachment.id} attachment={attachment} />
                ))}
              </div>
            )}

            {streaming && (
              <span
                aria-hidden
                className="bg-foreground ml-0.5 inline-block h-[1.05em] w-[2px] translate-y-[0.18em] rounded-full"
                style={{ animation: "caret-blink 1s steps(1) infinite" }}
              />
            )}
          </>
        )}

        {message.status === "stopped" && (
          <p className="text-muted-foreground mt-2 text-xs">Réponse interrompue.</p>
        )}

        {!streaming && <MessageActions message={message} />}
      </div>
    </div>
  );
}
