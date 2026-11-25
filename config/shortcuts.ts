export interface Shortcut {
  id: string;
  label: string;
  keys: string[];
  group: "Navigation" | "Conversation" | "Affichage";
}

export const SHORTCUTS: Shortcut[] = [
  { id: "new-chat", label: "Nouvelle conversation", keys: ["mod", "K"], group: "Conversation" },
  { id: "stop", label: "Arrêter la génération", keys: ["Échap"], group: "Conversation" },
  { id: "search", label: "Rechercher une conversation", keys: ["mod", "F"], group: "Navigation" },
  { id: "settings", label: "Paramètres", keys: ["mod", ","], group: "Navigation" },
  { id: "sidebar", label: "Replier la barre latérale", keys: ["mod", "B"], group: "Affichage" },
  { id: "scheme", label: "Basculer clair / sombre", keys: ["mod", "⇧", "L"], group: "Affichage" },
];

export const SHORTCUT_GROUPS = ["Conversation", "Navigation", "Affichage"] as const;
