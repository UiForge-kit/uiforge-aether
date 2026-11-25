"use client";

import { useState } from "react";
import {
  Copy01Icon,
  MoreHorizontalIcon,
  RefreshIcon,
  Share08Icon,
  ThumbsDownIcon,
  ThumbsUpIcon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { AnimatePresence, motion } from "motion/react";
import { Icon } from "@/components/icon";
import { PRO_LOCKED_COPY } from "@/components/pro/pro-locked";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getModel } from "@/config/models";
import { useCopy } from "@/hooks/use-copy";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useChatStore } from "@/store/chat-store";
import { useFeedbackStore } from "@/store/feedback-store";
import { ShareDialog, moduleDef as share } from "@/modules/share";
import type { Message } from "@/types/chat";

export function MessageActions({ message }: { message: Message }) {
  const [sharing, setSharing] = useState(false);
  const vote = useFeedbackStore((state) => state.votes[message.id]);
  const toggleVote = useFeedbackStore((state) => state.toggle);
  const regenerate = useChatStore((state) => state.regenerateMessage);
  const busy = useChatStore((state) => state.streamingMessageId !== null);
  const { copied, copy } = useCopy();

  const failed = message.status === "error";
  const model = message.modelId ? getModel(message.modelId) : null;
  const retry = () => void regenerate(message.id);

  // keep the bar visible when it carries state: rating given, interrupted
  // reply, error to retry
  const pinned = Boolean(vote) || failed || message.status === "stopped";

  return (
    <div
      className={cn(
        "mt-2 flex items-center gap-0.5 transition-opacity focus-within:opacity-100 has-data-[popup-open]:opacity-100 group-hover/message:opacity-100",
        // no hover on touch, only hide where a pointer exists
        !pinned && "[@media(hover:hover)]:opacity-0",
      )}
    >
      {failed ? (
        <Button
          variant="ghost"
          size="xs"
          onClick={retry}
          disabled={busy}
          className="text-muted-foreground"
        >
          <Icon icon={RefreshIcon} size={13} />
          Réessayer
        </Button>
      ) : (
        <>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => void copy(message.content)}
            aria-label="Copier la réponse"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={copied ? "copied" : "idle"}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.12, ease: "easeOut" }}
              >
                <Icon icon={copied ? Tick02Icon : Copy01Icon} size={14} />
              </motion.span>
            </AnimatePresence>
          </Button>

          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => toggleVote(message.id, "up")}
            aria-pressed={vote === "up"}
            aria-label="Réponse utile"
            className={cn(vote === "up" && "text-brand hover:text-brand")}
          >
            <Icon icon={ThumbsUpIcon} size={14} />
          </Button>

          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => toggleVote(message.id, "down")}
            aria-pressed={vote === "down"}
            aria-label="Réponse à améliorer"
            className={cn(vote === "down" && "text-destructive hover:text-destructive")}
          >
            <Icon icon={ThumbsDownIcon} size={14} />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger
              render={<Button variant="ghost" size="icon-xs" />}
              aria-label="Autres actions"
            >
              <Icon icon={MoreHorizontalIcon} size={14} />
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start" className="w-44">
              <DropdownMenuItem onClick={retry} disabled={busy}>
                <Icon icon={RefreshIcon} size={15} />
                Réessayer
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSharing(true)} disabled={share.locked}>
                <Icon icon={Share08Icon} size={15} />
                <span className="flex-1">Partager</span>
                {share.locked && (
                  <span className="text-muted-foreground text-[0.6875rem]">
                    {PRO_LOCKED_COPY.badge}
                  </span>
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <ShareDialog
            open={sharing}
            onOpenChange={setSharing}
            resource={shareLabel(message.content)}
          />
        </>
      )}

      <span
        className={cn(
          "text-muted-foreground ml-2 text-[0.6875rem]",
          !model && !message.usage && "hidden",
        )}
        data-numeric
      >
        {model?.name}
        {message.usage && ` · ${formatNumber(message.usage.total)} tokens`}
      </span>
    </div>
  );
}

function shareLabel(content: string): string {
  const clean = content.replace(/[*_`#>\n]/g, " ").replace(/\s+/g, " ").trim();
  return clean ? `Réponse · ${clean.slice(0, 70)}` : "Réponse";
}
