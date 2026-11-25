import { Share08Icon } from "@hugeicons/core-free-icons";
import { ProLockedButton } from "@/components/pro/pro-locked-button";
import type { ModuleDef } from "@/config/modules";

export const moduleDef: ModuleDef = {
  id: "share",
  tier: "pro",
  locked: true,
  label: "Partage",
  description: "Partagez une conversation par lien public ou par invitation nominative.",
};

export function ShareButton({ resource }: { resource: string }) {
  void resource;
  return <ProLockedButton icon={Share08Icon} label="Partager" />;
}

export function ShareDialog(props: { open: boolean; onOpenChange: (open: boolean) => void; resource: string }) {
  void props;
  return null;
}
