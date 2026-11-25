"use client";

import type { IconSvgElement } from "@hugeicons/react";
import { Icon } from "@/components/icon";
import { PRO_LOCKED_COPY } from "@/components/pro/pro-locked";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function ProLockedButton({ icon, label }: { icon: IconSvgElement; label: string }) {
  return (
    <Tooltip>
      {/* a disabled button swallows pointer events, the tooltip needs a live wrapper */}
      <TooltipTrigger render={<span className="inline-flex" />}>
        <Button variant="ghost" size="icon-sm" className="rounded-full" disabled aria-label={label}>
          <Icon icon={icon} size={17} />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        {label} · {PRO_LOCKED_COPY.badge}
      </TooltipContent>
    </Tooltip>
  );
}
