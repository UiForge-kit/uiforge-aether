"use client";

import { AnimatePresence, motion } from "motion/react";
import { Sidebar } from "@/components/sidebar/sidebar";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { useUIStore } from "@/store/ui-store";

// topbar height, shared with the scroll areas that reserve it. If the two
// diverge the glass cuts a message in half
const PANEL_VARS = { "--topbar-height": "3.5rem" } as React.CSSProperties;

// rail on large screens, drawer on mobile. Both Sidebar instances read the
// same store, only the markup is duplicated
export function AppShell({ children }: { children: React.ReactNode }) {
  const { mobileNavOpen, setMobileNav, sidebarCollapsed } = useUIStore();

  return (
    <div className="bg-surface flex h-dvh overflow-hidden">
      <AnimatePresence initial={false}>
        {!sidebarCollapsed && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "var(--rail-width)", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.32, 0.72, 0, 1] }}
            className="hidden shrink-0 overflow-hidden md:block"
          >
            <div className="h-full w-rail">
              <Sidebar />
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      <Sheet open={mobileNavOpen} onOpenChange={setMobileNav}>
        <SheetContent side="left" className="w-[19rem] p-0 sm:max-w-[19rem]" showCloseButton={false}>
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <Sidebar />
        </SheetContent>
      </Sheet>

      <main
        style={PANEL_VARS}
        className="border-border bg-canvas relative m-2 mb-0 flex min-w-0 flex-1 flex-col overflow-hidden rounded-t-2xl border border-b-0 md:m-2.5 md:mb-0"
      >
        {children}
      </main>
    </div>
  );
}
