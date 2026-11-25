import { FolderLibraryIcon } from "@hugeicons/core-free-icons";
import { ProLockedPage } from "@/components/pro/pro-locked-page";
import type { ModuleDef } from "@/config/modules";

export const moduleDef: ModuleDef = {
  id: "projects",
  tier: "pro",
  locked: true,
  label: "Projets",
  description:
    "Regroupez vos conversations par projet, avec consignes permanentes et fichiers de contexte.",
  href: "/projects",
  nav: { icon: FolderLibraryIcon, group: "primary" },
  sitemap: true,
};

export function Page() {
  return <ProLockedPage feature={moduleDef.label} description={moduleDef.description} />;
}

export function DetailPage({ projectId }: { projectId: string }) {
  void projectId;
  return <Page />;
}

export function useConversationSection(conversationId?: string): { label: string; href: string } | undefined {
  void conversationId;
  return undefined;
}
