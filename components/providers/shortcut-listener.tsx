"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { MODULES } from "@/config/modules";
import { matchesShortcut } from "@/lib/shortcuts";
import { useChatStore } from "@/store/chat-store";
import { useThemeStore } from "@/store/theme-store";
import { useUIStore } from "@/store/ui-store";

// single root listener keeps priority order readable and gives one place
// to check a combo is free
export function ShortcutListener() {
  const router = useRouter();

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const mod = event.metaKey || event.ctrlKey;

      // only shortcut that fires while typing in the composer
      if (event.key === "Escape" && useChatStore.getState().streamingMessageId) {
        useChatStore.getState().stopStreaming();
        return;
      }

      if (!mod) return;

      const key = event.key.toLowerCase();

      // home acts as the blank conversation, the thread is only created on the
      // first message so history gets no empty threads
      if (key === "k" && !event.shiftKey) {
        event.preventDefault();
        router.push("/");
        return;
      }

      // module shortcuts go to the module page, or to its stub when locked
      for (const def of MODULES) {
        const hit = def.shortcuts?.find((shortcut) => matchesShortcut(event, shortcut.keys));
        if (hit) {
          event.preventDefault();
          router.push(hit.href);
          return;
        }
      }

      if (key === "l" && event.shiftKey) {
        event.preventDefault();
        useThemeStore.getState().toggleScheme();
        return;
      }

      if (key === ",") {
        event.preventDefault();
        router.push("/settings");
        return;
      }

      if (key === "b") {
        event.preventDefault();
        useUIStore.getState().toggleSidebar();
        return;
      }

      if (key === "f") {
        event.preventDefault();
        useUIStore.getState().setCommandOpen(true);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [router]);

  return null;
}
