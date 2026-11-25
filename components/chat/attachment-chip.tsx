"use client";

import {
  Cancel01Icon,
  File01Icon,
  Image01Icon,
  Mic01Icon,
  SourceCodeIcon,
} from "@hugeicons/core-free-icons";
import { Icon } from "@/components/icon";
import { formatBytes } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Attachment } from "@/types/chat";

const ICONS = {
  image: Image01Icon,
  document: File01Icon,
  audio: Mic01Icon,
  code: SourceCodeIcon,
} as const;

interface AttachmentChipProps {
  attachment: Attachment;
  onRemove?: (id: string) => void;
  className?: string;
}

export function AttachmentChip({ attachment, onRemove, className }: AttachmentChipProps) {
  return (
    <span
      className={cn(
        "border-border bg-surface inline-flex max-w-52 items-center gap-2 rounded-lg border py-1 pr-1 pl-2",
        className,
      )}
    >
      {attachment.previewUrl ? (
        // eslint-disable-next-line @next/next/no-img-element -- objectURL local, hors du champ de next/image
        <img
          src={attachment.previewUrl}
          alt=""
          className="size-7 shrink-0 rounded-md object-cover"
        />
      ) : (
        <span className="bg-muted grid size-7 shrink-0 place-items-center rounded-md">
          <Icon icon={ICONS[attachment.kind]} size={14} className="text-muted-foreground" />
        </span>
      )}

      <span className="min-w-0 flex-1 py-0.5">
        <span className="block truncate text-xs leading-tight font-medium">
          {attachment.name}
        </span>
        <span className="text-muted-foreground block text-[0.6875rem] leading-tight">
          {formatBytes(attachment.size)}
        </span>
      </span>

      {onRemove && (
        <button
          type="button"
          onClick={() => onRemove(attachment.id)}
          aria-label={`Retirer ${attachment.name}`}
          className="text-muted-foreground hover:bg-muted hover:text-foreground rounded p-1 transition-colors"
        >
          <Icon icon={Cancel01Icon} size={13} />
        </button>
      )}
    </span>
  );
}
