import type { ComponentType } from "react";
import type { IconSvgElement } from "@hugeicons/react";
import type { Shortcut } from "@/config/shortcuts";
import { moduleDef as billing } from "@/modules/billing";
import { moduleDef as images } from "@/modules/images";
import { moduleDef as incognito } from "@/modules/incognito";
import { moduleDef as integrations } from "@/modules/integrations";
import { moduleDef as notifications } from "@/modules/notifications";
import { moduleDef as privacy } from "@/modules/privacy";
import { moduleDef as projects } from "@/modules/projects";
import { moduleDef as share } from "@/modules/share";
import { moduleDef as storage } from "@/modules/storage";
import { moduleDef as usage } from "@/modules/usage";
import { moduleDef as voice } from "@/modules/voice";

// single registry read by navigation, settings, shortcuts, sitemap and store hydration.
// never import it from a component a module renders: modules are imported here, that would be a cycle

export type ModuleTier = "free" | "pro";

export interface ModuleShortcut extends Shortcut {
  /** Where the shortcut navigates. A locked module lands on its stub. */
  href: string;
}

export interface ModuleDef {
  id: string;
  tier: ModuleTier;
  /** Set by the stub only: the module exists but its implementation is not shipped. */
  locked?: boolean;
  label: string;
  description: string;
  href?: string;
  nav?: {
    icon: IconSvgElement;
    group: "primary" | "footer";
    userMenu?: boolean;
  };
  settings?: {
    id: string;
    label: string;
    icon: IconSvgElement;
    /** Position among the other settings sections, lowest first. */
    order: number;
    Component: ComponentType;
  };
  shortcuts?: ModuleShortcut[];
  sitemap?: boolean;
  /** Reads persisted state, called once on mount. */
  hydrate?: () => void;
}

export const MODULES: ModuleDef[] = [
  projects,
  integrations,
  images,
  voice,
  usage,
  share,
  incognito,
  notifications,
  privacy,
  billing,
  storage,
];

export function modulesIn(group: "primary" | "footer"): ModuleDef[] {
  return MODULES.filter((module) => module.nav?.group === group);
}
