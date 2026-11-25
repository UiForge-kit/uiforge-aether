"use client";

import Link from "next/link";
import { FlashIcon } from "@hugeicons/core-free-icons";
import { motion } from "motion/react";
import { Icon } from "@/components/icon";
import { cn } from "@/lib/utils";

export function UpgradeCta({ className }: { className?: string }) {
  return (
    <Link
      href="/settings?section=facturation"
      className={cn(
        "group border-brand/25 bg-brand-subtle text-brand hover:border-brand/45 relative flex h-8 items-center gap-1.5 overflow-hidden rounded-full border pr-3 pl-2.5 text-xs font-medium transition-colors",
        className,
      )}
    >
      <motion.span
        aria-hidden
        className="via-brand/15 absolute inset-0 bg-gradient-to-r from-transparent to-transparent"
        initial={{ x: "-100%" }}
        animate={{ x: "100%" }}
        transition={{ repeat: Infinity, duration: 3.2, ease: "easeInOut", repeatDelay: 2.4 }}
      />
      <Icon icon={FlashIcon} size={14} className="relative" />
      <span className="relative hidden sm:inline">Passer en Premium</span>
    </Link>
  );
}
