"use client";

import { Card, Row } from "@/components/settings/primitives";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Switch } from "@/components/ui/switch";
import { LANGUAGES } from "@/config/languages";
import { cn } from "@/lib/utils";
import { usePreferencesStore } from "@/store/preferences-store";
import type { SendBehavior } from "@/types/settings";

const BEHAVIORS: Array<{ value: SendBehavior; label: string }> = [
  { value: "enter", label: "Entrée" },
  { value: "mod-enter", label: "Ctrl + Entrée" },
];

export function ConversationSection() {
  const { sendBehavior, showReasoning, language, set } = usePreferencesStore();

  return (
    <>
      <Card title="Conversation">
        <Row label="Touche d'envoi" hint="L'autre combinaison insère un retour à la ligne.">
          <SegmentedControl
            options={BEHAVIORS}
            value={sendBehavior}
            onChange={(value) => set("sendBehavior", value)}
          />
        </Row>
        <Row
          label="Déplier le raisonnement"
          hint="Affiche les étapes intermédiaires sans avoir à cliquer."
        >
          <Switch checked={showReasoning} onCheckedChange={(value) => set("showReasoning", value)} />
        </Row>
      </Card>

      <Card
        title="Langue de l'interface"
        description="Le choix est mémorisé ; le template ne contient pas encore de traductions."
      >
        <div className="grid gap-1.5 sm:grid-cols-2">
          {LANGUAGES.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => set("language", option.id)}
              aria-pressed={option.id === language}
              className={cn(
                "flex items-center gap-2.5 rounded-lg border px-3 py-2 text-left transition-colors",
                option.id === language
                  ? "border-brand bg-brand-subtle/50"
                  : "border-border hover:border-border-strong",
              )}
            >
              <span aria-hidden className="text-base">
                {option.flag}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[0.8125rem]">{option.label}</span>
                <span className="text-muted-foreground block text-xs">{option.region}</span>
              </span>
            </button>
          ))}
        </div>
      </Card>
    </>
  );
}
