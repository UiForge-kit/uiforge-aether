"use client";

import { ArrowDown01Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { Icon } from "@/components/icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PRO_LOCKED_COPY } from "@/components/pro/pro-locked";
import { LIMITS } from "@/config/limits";
import { MODELS, getModel } from "@/config/models";
import { isModelAllowed } from "@/lib/api/entitlements";
import { formatCompact } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useComposerStore } from "@/store/composer-store";

const BADGE_LABELS = { new: "Nouveau", fast: "Rapide", pro: "Pro" } as const;

interface ModelSelectorProps {
  variant?: "default" | "compact";
  className?: string;
}

export function ModelSelector({ variant = "default", className }: ModelSelectorProps) {
  const { modelId, setModel } = useComposerStore();
  const active = getModel(modelId);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size={variant === "compact" ? "sm" : "default"}
            className={cn("gap-1.5", className)}
          />
        }
      >
        <span className="font-medium">{active.name}</span>
        <Icon icon={ArrowDown01Icon} size={14} className="text-muted-foreground" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-80" sideOffset={6}>
        {/* Base UI requires a parent Group for GroupLabel */}
        <DropdownMenuGroup>
          <DropdownMenuLabel>Modèle</DropdownMenuLabel>
          {MODELS.map((model) => {
            const locked = !isModelAllowed(model.id, LIMITS);
            return (
              <DropdownMenuItem
                key={model.id}
                disabled={!model.available || locked}
                onClick={() => setModel(model.id)}
                className="items-start gap-2 py-1.5"
              >
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1.5">
                    <span className="text-[0.8125rem] font-medium">{model.name}</span>
                    {model.badge && (
                      <Badge
                        variant={model.badge === "pro" ? "default" : "secondary"}
                        className="h-4 px-1.5 text-[0.625rem]"
                      >
                        {BADGE_LABELS[model.badge]}
                      </Badge>
                    )}
                    {locked && model.badge !== "pro" && (
                      <Badge variant="outline" className="h-4 px-1.5 text-[0.625rem]">
                        {PRO_LOCKED_COPY.badge}
                      </Badge>
                    )}
                    {!model.available && (
                      <Badge variant="outline" className="h-4 px-1.5 text-[0.625rem]">
                        Indisponible
                      </Badge>
                    )}
                  </span>
                  <span className="text-muted-foreground/80 mt-0.5 block text-[0.625rem]">
                    {formatCompact(model.contextWindow)} tokens de contexte · $
                    {model.pricing.inputPerMTok}/M entrée
                  </span>
                </span>
                {model.id === modelId && (
                  <Icon icon={Tick02Icon} size={14} className="text-brand mt-0.5" />
                )}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
