import type { MetadataRoute } from "next";
import { MODULES } from "@/config/modules";
import { ALLOW_INDEXING, SITE_URL } from "@/config/site";

// Public, static pages only: /c/[id] and /projects/[id] are per-user.
const ROUTES = [
  "/",
  ...MODULES.flatMap((module) => (module.sitemap && module.href ? [module.href] : [])),
  "/settings",
];

export default function sitemap(): MetadataRoute.Sitemap {
  if (!ALLOW_INDEXING) return [];
  return ROUTES.map((href) => ({
    url: `${SITE_URL}${href === "/" ? "" : href}`,
    changeFrequency: "daily",
  }));
}
