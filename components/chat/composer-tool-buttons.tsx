"use client";

import { useRef } from "react";
import {
  Attachment01Icon,
  BrainIcon,
  Globe02Icon,
  Note01Icon,
  SourceCodeIcon,
} from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";
import { Icon } from "@/components/icon";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { PRO_LOCKED_COPY } from "@/components/pro/pro-locked";
import { COMPOSER_TOOLS } from "@/config/composer-tools";
import { LIMITS } from "@/config/limits";
import { getModel } from "@/config/models";
import { isToolAllowed } from "@/lib/api/entitlements";
import { cn } from "@/lib/utils";
import type { ComposerToolId } from "@/types/model";

const TOOL_ICONS: Record<ComposerToolId, IconSvgElement> = {
  attachments: Attachment01Icon,
  "web-search": Globe02Icon,
  "extended-thinking": BrainIcon,
  "code-interpreter": SourceCodeIcon,
  canvas: Note01Icon,
};

interface ComposerToolButtonsProps {
  capabilities: ReturnType<typeof getModel>["capabilities"];
  enabled: ComposerToolId[];
  onToggle: (id: ComposerToolId) => void;
  onPickFiles: (files: File[]) => void;
}

export function ComposerToolButtons({
  capabilities,
  enabled,
  onToggle,
  onPickFiles,
}: ComposerToolButtonsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(event) => {
          onPickFiles(Array.from(event.target.files ?? []));
          event.target.value = "";
        }}
      />

      {COMPOSER_TOOLS.map((tool) => {
        const locked = !isToolAllowed(tool.id, LIMITS);
        const unsupported = tool.requires ? !capabilities[tool.requires] : false;
        const active = enabled.includes(tool.id);

        return (
          <Tooltip key={tool.id}>
            <TooltipTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  disabled={unsupported || locked}
                  onClick={() =>
                    tool.kind === "action"
                      ? fileInputRef.current?.click()
                      : onToggle(tool.id)
                  }
                  className={cn(
                    "relative",
                    active && "bg-brand-subtle text-brand hover:bg-brand-subtle",
                  )}
                />
              }
              aria-pressed={tool.kind === "toggle" ? active : undefined}
              aria-label={tool.label}
            >
              <Icon icon={TOOL_ICONS[tool.id]} size={16} />
            </TooltipTrigger>
            <TooltipContent className="max-w-56 flex-col items-start gap-0.5 py-1.5">
              <span className="font-medium">{tool.label}</span>
              <span className="opacity-70">
                {locked
                  ? `${PRO_LOCKED_COPY.title}.`
                  : unsupported
                    ? "Non pris en charge par ce modèle."
                    : tool.description}
              </span>
            </TooltipContent>
          </Tooltip>
        );
      })}
    </>
  );
}
