import { Analytics01Icon } from "@hugeicons/core-free-icons";
import { ProLockedPage } from "@/components/pro/pro-locked-page";
import type { ModuleDef } from "@/config/modules";

export const moduleDef: ModuleDef = {
  id: "usage",
  tier: "pro",
  locked: true,
  label: "Consommation",
  description:
    "Quota, tokens par jour, répartition par modèle et coût estimé.",
  href: "/usage",
  nav: { icon: Analytics01Icon, group: "footer", userMenu: true },
  sitemap: true,
};

export function Page() {
  return <ProLockedPage feature={moduleDef.label} description={moduleDef.description} />;
}
