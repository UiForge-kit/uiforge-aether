"use client";

import { useEffect } from "react";
import { CanvasDialog } from "@/components/canvas/canvas-dialog";
import { ShortcutListener } from "@/components/providers/shortcut-listener";
import { CommandSearch } from "@/components/search/command-search";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MODULES } from "@/config/modules";
import { useChatStore } from "@/store/chat-store";
import { useFeedbackStore } from "@/store/feedback-store";
import { usePreferencesStore } from "@/store/preferences-store";
import { useProfileStore } from "@/store/profile-store";
import { useThemeStore } from "@/store/theme-store";

export function AppProviders({ children }: { children: React.ReactNode }) {
  const fontFamily = usePreferencesStore((state) => state.fontFamily);

  useEffect(() => {
    useThemeStore.getState().hydrate();
    usePreferencesStore.getState().hydrate();
    useProfileStore.getState().hydrate();
    useFeedbackStore.getState().hydrate();
    for (const def of MODULES) def.hydrate?.();
    void useChatStore.getState().hydrate();
  }, []);

  // the anti-flash script already sets the attribute on load, this only
  // covers changes made from settings
  useEffect(() => {
    const root = document.documentElement;
    if (fontFamily === "auto") root.removeAttribute("data-font");
    else root.dataset.font = fontFamily;
  }, [fontFamily]);

  return (
    <TooltipProvider delay={300}>
      <ShortcutListener />
      {/* here and not in Sidebar, which renders twice (rail and drawer) */}
      <CommandSearch />
      <CanvasDialog />
      {children}
    </TooltipProvider>
  );
}
