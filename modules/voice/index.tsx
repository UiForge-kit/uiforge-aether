import { Mic01Icon } from "@hugeicons/core-free-icons";
import { ProLocked } from "@/components/pro/pro-locked";
import { ProLockedPage } from "@/components/pro/pro-locked-page";
import type { ModuleDef } from "@/config/modules";

export const moduleDef: ModuleDef = {
  id: "voice",
  tier: "pro",
  locked: true,
  label: "Voix",
  description:
    "Dictée et réponses parlées, avec choix de la voix et de la langue.",
  href: "/voice",
  shortcuts: [
    { id: "voice", label: "Mode vocal", keys: ["mod", "⇧", "V"], group: "Conversation", href: "/voice" },
  ],
  settings: { id: "voix", label: "Voix", icon: Mic01Icon, order: 50, Component: LockedSettings },
  sitemap: true,
};

export function Page() {
  return <ProLockedPage feature={moduleDef.label} description={moduleDef.description} />;
}

function LockedSettings() {
  return <ProLocked feature={moduleDef.label} description={moduleDef.description} />;
}
