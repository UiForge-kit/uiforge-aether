import { Suspense } from "react";
import type { Metadata } from "next";
import { SettingsView } from "@/components/settings/settings-view";

export const metadata: Metadata = { title: "Paramètres" };

export default function SettingsPage() {
  // useSearchParams forces client rendering, Suspense keeps that from
  // dragging the whole page along
  return (
    <Suspense fallback={null}>
      <SettingsView />
    </Suspense>
  );
}
