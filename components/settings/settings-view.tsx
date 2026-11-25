"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { KeyboardIcon, PaintBoardIcon, RepeatIcon, UserCircleIcon } from "@hugeicons/core-free-icons";
import { motion } from "motion/react";
import type { IconSvgElement } from "@hugeicons/react";
import { Icon } from "@/components/icon";
import { ScrollRegion } from "@/components/layout/scroll-region";
import { PRO_LOCKED_COPY } from "@/components/pro/pro-locked";
import { AppearanceSection } from "@/components/settings/sections/appearance";
import { ConversationSection } from "@/components/settings/sections/conversation";
import { ProfileSection } from "@/components/settings/sections/profile";
import { ShortcutsSection } from "@/components/settings/sections/shortcuts";
import { Topbar } from "@/components/topbar/topbar";
import { Badge } from "@/components/ui/badge";
import { MODULES } from "@/config/modules";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/store/ui-store";

interface Section {
  id: string;
  label: string;
  icon: IconSvgElement;
  order: number;
  locked?: boolean;
  render: React.ComponentType;
}

// One file per tab. The id doubles as the deep link, via `?section=`.
// Modules slot in between the core sections through their `order`.
const SECTIONS: Section[] = [
  { id: "profil", label: "Profil", icon: UserCircleIcon, order: 10, render: ProfileSection },
  { id: "apparence", label: "Apparence", icon: PaintBoardIcon, order: 20, render: AppearanceSection },
  { id: "conversation", label: "Conversation", icon: RepeatIcon, order: 30, render: ConversationSection },
  { id: "raccourcis", label: "Raccourcis", icon: KeyboardIcon, order: 100, render: ShortcutsSection },
  ...MODULES.flatMap((module) =>
    module.settings
      ? [{ ...module.settings, locked: module.locked, render: module.settings.Component }]
      : [],
  ),
].sort((a, b) => a.order - b.order);

export function SettingsView() {
  const params = useSearchParams();
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);
  const requested = params.get("section");

  const [active, setActive] = useState(
    SECTIONS.find((section) => section.id === requested)?.id ?? "profil",
  );

  const current = SECTIONS.find((section) => section.id === active) ?? SECTIONS[0];
  const Section = current.render;

  return (
    <>
      <Topbar title="Paramètres" section="Compte" onToggleSidebar={toggleSidebar} />

      <ScrollRegion>
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-6 md:flex-row md:px-6 md:py-8">
          <nav className="scrollbar-slim -mx-1 flex shrink-0 gap-1 overflow-x-auto px-1 md:mx-0 md:w-52 md:flex-col md:overflow-visible md:px-0">
            {SECTIONS.map((section) => (
              <button
                key={section.id}
                type="button"
                onClick={() => setActive(section.id)}
                className={cn(
                  "flex h-9 shrink-0 items-center gap-2 rounded-lg px-2.5 text-[0.8125rem] transition-colors",
                  active === section.id
                    ? "bg-secondary text-secondary-foreground font-medium"
                    : "text-foreground/85 hover:bg-muted",
                )}
              >
                <Icon icon={section.icon} size={16} className="text-muted-foreground" />
                <span className="flex-1 text-left">{section.label}</span>
                {section.locked && (
                  <Badge variant="secondary" className="h-4 px-1.5 text-[0.625rem]">
                    {PRO_LOCKED_COPY.badge}
                  </Badge>
                )}
              </button>
            ))}
          </nav>

          <motion.div
            key={active}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="min-w-0 flex-1 space-y-3"
          >
            <Section />
          </motion.div>
        </div>
      </ScrollRegion>
    </>
  );
}
