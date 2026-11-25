"use client";

import { useState } from "react";
import {
  ArrowRight01Icon,
  BrainIcon,
  Globe02Icon,
  Loading03Icon,
  SourceCodeIcon,
} from "@hugeicons/core-free-icons";
import { AnimatePresence, motion } from "motion/react";
import { Icon } from "@/components/icon";
import { cn } from "@/lib/utils";
import { usePreferencesStore } from "@/store/preferences-store";
import type { ReasoningStep } from "@/types/chat";

const ICONS = {
  thinking: BrainIcon,
  search: Globe02Icon,
  tool: SourceCodeIcon,
  fetch: SourceCodeIcon,
} as const;

export function ReasoningTrail({ steps }: { steps: ReasoningStep[] }) {
  const showReasoning = usePreferencesStore((state) => state.showReasoning);
  const [expanded, setExpanded] = useState<string | null>(
    showReasoning ? (steps.find((step) => step.detail)?.id ?? null) : null,
  );

  return (
    <div className="mb-3 space-y-0.5">
      {steps.map((step) => {
        const open = expanded === step.id;
        const running = step.status === "running";

        return (
          <div key={step.id}>
            <button
              type="button"
              onClick={() => setExpanded(open ? null : step.id)}
              disabled={!step.detail}
              className={cn(
                "text-muted-foreground -mx-1.5 flex items-center gap-1.5 rounded-md px-1.5 py-1 text-[0.8125rem] transition-colors",
                step.detail && "hover:text-foreground hover:bg-muted/60",
              )}
            >
              <motion.span
                animate={running ? { rotate: 360 } : { rotate: 0 }}
                transition={
                  running ? { repeat: Infinity, duration: 1.1, ease: "linear" } : { duration: 0 }
                }
                className="flex"
              >
                <Icon icon={running ? Loading03Icon : ICONS[step.kind]} size={14} />
              </motion.span>

              <span className={cn(running && "animate-pulse")}>{step.label}</span>

              {step.durationMs && !running && (
                <span className="text-muted-foreground/70 text-xs">
                  {(step.durationMs / 1000).toFixed(0)} s
                </span>
              )}

              {step.detail && (
                <Icon
                  icon={ArrowRight01Icon}
                  size={13}
                  className={cn("transition-transform", open && "rotate-90")}
                />
              )}
            </button>

            <AnimatePresence initial={false}>
              {open && step.detail && (
                <motion.p
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  className="text-muted-foreground border-border overflow-hidden border-l pl-3 text-[0.8125rem]"
                >
                  <span className="block py-1.5">{step.detail}</span>
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
