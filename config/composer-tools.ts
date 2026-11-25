import { LIMITS } from "@/config/limits";
import type { ComposerTool } from "@/types/model";

export const COMPOSER_TOOLS: ComposerTool[] = [
  {
    id: "attachments",
    label: "Joindre",
    description: `Images, PDF, code : jusqu'à ${LIMITS.maxAttachments} fichiers.`,
    kind: "action",
    defaultEnabled: false,
    requires: "vision",
  },
  {
    id: "web-search",
    label: "Recherche web",
    description: "Le modèle consulte des sources en ligne avant de répondre.",
    kind: "toggle",
    defaultEnabled: false,
    requires: "webSearch",
  },
  {
    id: "extended-thinking",
    label: "Réflexion étendue",
    description: "Plus de temps de raisonnement sur les problèmes complexes.",
    kind: "toggle",
    defaultEnabled: false,
    requires: "reasoning",
  },
  {
    id: "code-interpreter",
    label: "Exécution de code",
    description: "Lance du Python dans un bac à sable et renvoie le résultat.",
    kind: "toggle",
    defaultEnabled: false,
    requires: "tools",
  },
  {
    id: "canvas",
    label: "Canvas",
    description: "Ouvre un document éditable à côté de la conversation.",
    kind: "toggle",
    defaultEnabled: false,
  },
];

export function getComposerTool(id: string): ComposerTool | undefined {
  return COMPOSER_TOOLS.find((tool) => tool.id === id);
}
