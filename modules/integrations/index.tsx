import { PuzzleIcon } from "@hugeicons/core-free-icons";
import { ProLocked } from "@/components/pro/pro-locked";
import { ProLockedPage } from "@/components/pro/pro-locked-page";
import type { ModuleDef } from "@/config/modules";

export const moduleDef: ModuleDef = {
  id: "integrations",
  tier: "pro",
  locked: true,
  label: "Intégrations",
  description:
    "Connectez vos services (stockage, paiement, productivité) et gérez leurs accès.",
  href: "/integrations",
  nav: { icon: PuzzleIcon, group: "primary", userMenu: true },
  shortcuts: [
    { id: "integrations", label: "Intégrations", keys: ["mod", "⇧", "I"], group: "Navigation", href: "/integrations" },
  ],
  settings: { id: "integrations", label: "Intégrations", icon: PuzzleIcon, order: 60, Component: LockedSettings },
  sitemap: true,
};

export function Page() {
  return <ProLockedPage feature={moduleDef.label} description={moduleDef.description} />;
}

function LockedSettings() {
  return <ProLocked feature={moduleDef.label} description={moduleDef.description} />;
}
