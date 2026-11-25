import { IncognitoIcon } from "@hugeicons/core-free-icons";
import { ProLockedButton } from "@/components/pro/pro-locked-button";
import { ProLockedPage } from "@/components/pro/pro-locked-page";
import type { ModuleDef } from "@/config/modules";

export const moduleDef: ModuleDef = {
  id: "incognito",
  tier: "pro",
  locked: true,
  label: "Conversation éphémère",
  description: "Discutez sans rien enregistrer : ni historique, ni trace sur l'appareil.",
  href: "/incognito",
  shortcuts: [
    {
      id: "incognito",
      label: "Conversation éphémère",
      keys: ["mod", "⇧", "N"],
      group: "Conversation",
      href: "/incognito",
    },
  ],
};

export function Page() {
  return <ProLockedPage feature={moduleDef.label} description={moduleDef.description} />;
}

export function IncognitoToggle() {
  return <ProLockedButton icon={IncognitoIcon} label={moduleDef.label} />;
}
