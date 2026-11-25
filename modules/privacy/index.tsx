import { Shield01Icon } from "@hugeicons/core-free-icons";
import { ProLocked } from "@/components/pro/pro-locked";
import type { ModuleDef } from "@/config/modules";

export const moduleDef: ModuleDef = {
  id: "privacy",
  tier: "pro",
  locked: true,
  label: "Confidentialité",
  description:
    "Données locales, double authentification et sessions actives.",
  settings: { id: "confidentialite", label: "Confidentialité", icon: Shield01Icon, order: 70, Component: Locked },
};

function Locked() {
  return <ProLocked feature={moduleDef.label} description={moduleDef.description} />;
}
