import { daysAgo } from "@/lib/date";
import type { Seed } from "./types";

export const A11Y_SEED: Seed = {
  id: "conv_a11y",
  title: "Accessibilité d'un fil qui se met à jour",
  modelId: "claude-sonnet-4-6",
  createdAt: daysAgo(2, 10, 0),
  updatedAt: daysAgo(2, 10, 48),
  turns: [
    {
      user: "Un lecteur d'écran doit-il annoncer chaque caractère qui arrive en streaming ?",
      assistant: `Non, et c'est le contresens le plus courant.

Une \`aria-live="polite"\` sur le texte en cours de streaming produit un flux d'annonces ininterrompu qui rend le fil inutilisable. La réponse ne doit être annoncée qu'une fois terminée.

En pratique : le conteneur du message en cours reste hors de la zone live, et vous annoncez à la fin. Pendant le streaming, une région live séparée suffit à signaler l'état — « réponse en cours », puis « réponse terminée ».

Prévoyez aussi un raccourci pour interrompre. Un utilisateur au clavier qui ne peut pas atteindre le bouton « Stop » sans traverser tout le message subit le même problème que celui qui n'entend rien.`,
      reasoning: [
        {
          id: "r1",
          kind: "search",
          label: "Recherche de 3 sources",
          detail:
            "WAI-ARIA live regions bonnes pratiques contenu progressif · aria-live polite verbosité lecteur d'écran · pattern annonce fin de génération",
          status: "done",
        },
      ],
      sources: [
        {
          id: "lnk_aria",
          url: "https://www.w3.org/WAI/ARIA/apg/practices/live-regions/",
          title: "Live Regions — ARIA Authoring Practices Guide",
          description:
            "Quand utiliser `polite`, `assertive` ou rien du tout, et pourquoi une région trop bavarde équivaut à pas de région.",
          siteName: "W3C WAI",
        },
      ],
      inputTokens: 58,
      outputTokens: 242,
    },
  ],
};
