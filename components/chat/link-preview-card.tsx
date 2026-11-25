"use client";

import { useState } from "react";
import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";
import { Icon } from "@/components/icon";
import { formatDay } from "@/lib/date";
import { cn } from "@/lib/utils";
import type { LinkPreview } from "@/types/chat";

function hostOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export function LinkPreviewCard({ link, className }: { link: LinkPreview; className?: string }) {
  const [faviconFailed, setFaviconFailed] = useState(false);
  const host = hostOf(link.url);

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noreferrer noopener"
      className={cn(
        "group border-border bg-surface hover:border-border-strong flex items-start gap-3 rounded-xl border p-3 transition-colors",
        className,
      )}
    >
      <span className="bg-muted grid size-9 shrink-0 place-items-center rounded-lg text-sm font-medium">
        {faviconFailed ? (
          link.siteName.charAt(0)
        ) : (
          <img
            src={`https://www.google.com/s2/favicons?sz=64&domain=${host}`}
            alt=""
            className="size-5"
            onError={() => setFaviconFailed(true)}
          />
        )}
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-1.5">
          <span className="text-muted-foreground truncate text-[0.6875rem]">
            {link.siteName} · {host}
          </span>
          {link.publishedAt && (
            <span className="text-muted-foreground/70 shrink-0 text-[0.6875rem]">
              {formatDay(link.publishedAt)}
            </span>
          )}
        </span>
        <span className="mt-0.5 block truncate text-[0.8125rem] font-medium">{link.title}</span>
        {link.description && (
          <span className="text-muted-foreground mt-0.5 line-clamp-2 block text-xs leading-snug">
            {link.description}
          </span>
        )}
      </span>

      <Icon
        icon={ArrowUpRight01Icon}
        size={15}
        className="text-muted-foreground mt-0.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
      />
    </a>
  );
}
