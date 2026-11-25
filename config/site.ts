export const SITE = {
  name: "Aether",
  shortName: "Aether",
  tagline: "Template open source d'interface de chat IA",
  description:
    "Base Next.js prête à brancher sur Anthropic, OpenAI ou n'importe quel provider : streaming, trois thèmes, données mockées.",
  repository: "https://github.com/UiForge-kit/uiforge-aether",
  // Purchase page shown on locked modules. Without a URL the card has no link.
  upgrade: { url: process.env.NEXT_PUBLIC_UPGRADE_URL ?? "" },
} as const;

export const STORAGE_NAMESPACE = "ai-chat-template";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

// Off unless explicitly enabled, so a demo or staging stays out of search results.
// Drives robots, sitemap and meta robots.
export const ALLOW_INDEXING = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";
