import { Notification01Icon } from "@hugeicons/core-free-icons";
import { ProLocked } from "@/components/pro/pro-locked";
import type { ModuleDef } from "@/config/modules";

export const moduleDef: ModuleDef = {
  id: "notifications",
  tier: "pro",
  locked: true,
  label: "Notifications",
  description:
    "Alertes de réponse, mentions, résumé hebdomadaire et son.",
  settings: { id: "notifications", label: "Notifications", icon: Notification01Icon, order: 40, Component: Locked },
};

function Locked() {
  return <ProLocked feature={moduleDef.label} description={moduleDef.description} />;
}
