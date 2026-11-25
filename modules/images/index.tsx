import { Image02Icon } from "@hugeicons/core-free-icons";
import { ProLockedPage } from "@/components/pro/pro-locked-page";
import type { ModuleDef } from "@/config/modules";

export const moduleDef: ModuleDef = {
  id: "images",
  tier: "pro",
  locked: true,
  label: "Images",
  description:
    "Générez des images à partir d'un prompt, filtrez la galerie, gardez vos favoris.",
  href: "/images",
  nav: { icon: Image02Icon, group: "primary" },
  sitemap: true,
};

export function Page() {
  return <ProLockedPage feature={moduleDef.label} description={moduleDef.description} />;
}
