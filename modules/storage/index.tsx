import { Database01Icon } from "@hugeicons/core-free-icons";
import { ProLocked } from "@/components/pro/pro-locked";
import type { ModuleDef } from "@/config/modules";

export const moduleDef: ModuleDef = {
  id: "storage",
  tier: "pro",
  locked: true,
  label: "Stockage",
  description:
    "Espace utilisé par vos pièces jointes, projets et exports.",
  settings: { id: "stockage", label: "Stockage", icon: Database01Icon, order: 90, Component: Locked },
};

function Locked() {
  return <ProLocked feature={moduleDef.label} description={moduleDef.description} />;
}
