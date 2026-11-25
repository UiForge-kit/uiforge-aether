import type { ReasoningStep } from "@/types/chat";

interface CannedReply {
  match: string[];
  reasoning?: Omit<ReasoningStep, "status">[];
  content: string;
}

const REPLIES: CannedReply[] = [
  {
    match: ["api", "brancher", "anthropic", "openai", "clé", "provider"],
    reasoning: [
      { id: "r1", kind: "thinking", label: "Lecture de la configuration", durationMs: 2400 },
      { id: "r2", kind: "tool", label: "Vérification des variables d'environnement" },
    ],
    content: `Le branchement tient en trois étapes, et aucune ne touche à l'interface.

**1. Les variables d'environnement**

Copiez \`.env.example\` vers \`.env.local\`, renseignez la clé du provider voulu et basculez \`AI_PROVIDER\`.

**2. L'adaptateur**

\`lib/ai/providers/anthropic.ts\` contient déjà la structure. Il ne reste qu'à traduire les événements du SDK vers les six événements de \`StreamEvent\` — \`start\`, \`reasoning\`, \`delta\`, \`usage\`, \`done\`, \`error\`.

**3. Rien d'autre**

La route \`/api/chat\` sélectionne l'adaptateur à l'exécution et les composants ne connaissent que \`StreamEvent\`. C'est tout l'intérêt de la couche d'abstraction : le provider est un détail d'implémentation.`,
  },
  {
    match: ["thème", "theme", "couleur", "design", "sombre", "dark"],
    reasoning: [{ id: "r1", kind: "thinking", label: "Réflexion", durationMs: 3100 }],
    content: `Trois thèmes sont livrés, chacun avec sa déclinaison claire et sombre.

**Minimal** — fond papier chaud, contrastes doux, ombres quasi absentes. C'est le thème par défaut.

**Contrast** — gris froids, bordures franches, densité plus élevée et rayons courts.

**Signature** — l'identité propre au template : orange chaud, rayons généreux, chiffres en display.

Le sélecteur se trouve en bas de la barre latérale. Le choix est conservé dans le \`localStorage\` et réappliqué avant le premier rendu, ce qui évite le flash de thème au rechargement.`,
  },
  {
    match: ["token", "coût", "cout", "quota", "usage", "prix", "facture"],
    reasoning: [
      { id: "r1", kind: "search", label: "Recherche de 3 sources", detail: "grilles tarifaires" },
    ],
    content: `La page **Usage** reprend tout : quota consommé, série des 30 derniers jours, répartition par modèle et coût cumulé.

Deux points valent d'être gardés en tête quand vous brancherez de vraies données :

Le coût d'une conversation croît de façon quadratique, pas linéaire. Chaque tour renvoie l'historique complet, donc le dixième message coûte bien plus cher que le premier.

Les tokens d'entrée mis en cache se facturent à part, souvent autour d'un dixième du tarif normal. Un compteur qui les additionne aux tokens d'entrée classiques surestime la facture de façon notable sur les longues conversations.`,
  },
  {
    match: ["mobile", "responsive", "écran", "tactile"],
    content: `L'interface bascule en drawer sous 768 px : la barre latérale sort d'un \`Sheet\`, la zone de saisie reste ancrée en bas et toutes les cibles tactiles font au moins 44 px.

Le point que la plupart des interfaces de chat ratent sur mobile est le clavier virtuel. La zone de saisie doit être positionnée par rapport au viewport visuel, pas au viewport de mise en page, sinon elle se retrouve masquée dès l'ouverture du clavier sur iOS.`,
  },
];

const FALLBACK: CannedReply = {
  match: [],
  reasoning: [{ id: "r1", kind: "thinking", label: "Réflexion", durationMs: 2000 }],
  content: `Aucune clé API n'est configurée pour l'instant, donc cette réponse provient du provider de secours intégré.

Le texte arrive par fragments successifs, exactement comme le ferait un vrai modèle — même route, même protocole SSE, même gestion de l'annulation. Seule la source du texte change.

Pour brancher un vrai modèle, renseignez \`ANTHROPIC_API_KEY\` ou \`OPENAI_API_KEY\` dans \`.env.local\` puis passez \`AI_PROVIDER\` sur le provider correspondant. L'interface, elle, ne bouge pas.`,
};

export function pickReply(prompt: string): CannedReply {
  const normalized = prompt.toLowerCase();
  return (
    REPLIES.find((reply) => reply.match.some((keyword) => normalized.includes(keyword))) ??
    FALLBACK
  );
}

export const SUGGESTED_PROMPTS = [
  {
    title: "Brancher une vraie API",
    prompt: "Comment brancher ma clé API Anthropic sur ce template ?",
  },
  {
    title: "Changer de thème",
    prompt: "Quels thèmes sont disponibles et comment en ajouter un ?",
  },
  {
    title: "Suivre la consommation",
    prompt: "Comment estimer le coût en tokens d'une conversation ?",
  },
  {
    title: "Adapter au mobile",
    prompt: "Que faut-il surveiller pour un chat vraiment utilisable sur mobile ?",
  },
];
