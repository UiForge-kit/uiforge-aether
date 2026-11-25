import { CreditCardIcon } from "@hugeicons/core-free-icons";
import { ProLocked } from "@/components/pro/pro-locked";
import type { ModuleDef } from "@/config/modules";

export const moduleDef: ModuleDef = {
  id: "billing",
  tier: "pro",
  locked: true,
  label: "Facturation",
  description:
    "Abonnement, moyens de paiement et historique des factures.",
  settings: { id: "facturation", label: "Facturation", icon: CreditCardIcon, order: 80, Component: Locked },
};

function Locked() {
  return <ProLocked feature={moduleDef.label} description={moduleDef.description} />;
}
