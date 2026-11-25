"use client";

import { Moon02Icon, Sun03Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { Icon } from "@/components/icon";
import { Card, Row } from "@/components/settings/primitives";
import { Swatch } from "@/components/theme/swatch";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { FONT_OPTIONS } from "@/config/fonts";
import { THEMES } from "@/config/themes";
import { cn } from "@/lib/utils";
import { usePreferencesStore } from "@/store/preferences-store";
import { useThemeStore } from "@/store/theme-store";
import type { FontScale } from "@/types/settings";
import type { ColorScheme } from "@/types/theme";

const SCHEMES: Array<{ value: ColorScheme; label: string; icon?: Parameters<typeof Icon>[0]["icon"] }> =
  [
    { value: "light", label: "Clair", icon: Sun03Icon },
    { value: "dark", label: "Sombre", icon: Moon02Icon },
    { value: "system", label: "Système" },
  ];

const SCALES: Array<{ value: FontScale; label: string }> = [
  { value: "compact", label: "Compacte" },
  { value: "normal", label: "Normale" },
  { value: "large", label: "Large" },
];

export function AppearanceSection() {
  const { themeId, scheme, setTheme, setScheme } = useThemeStore();
  const { fontScale, fontFamily, set } = usePreferencesStore();

  return (
    <>
      <Card title="Identité visuelle" description="Trois palettes complètes, pas trois nuances.">
        <div className="grid gap-2 sm:grid-cols-3">
          {THEMES.map((theme) => (
            <button
              key={theme.id}
              type="button"
              onClick={() => setTheme(theme.id)}
              className={cn(
                "rounded-xl border p-3 text-left transition-colors",
                theme.id === themeId
                  ? "border-brand bg-brand-subtle/50"
                  : "border-border hover:border-border-strong",
              )}
            >
              <span className="flex items-center justify-between">
                <Swatch colors={theme.swatch} />
                {theme.id === themeId && (
                  <Icon icon={Tick02Icon} size={15} className="text-brand" />
                )}
              </span>
              <span className="mt-2 block text-[0.8125rem] font-medium">{theme.name}</span>
              <span className="text-muted-foreground mt-0.5 block text-xs leading-snug">
                {theme.description}
              </span>
            </button>
          ))}
        </div>
      </Card>

      <Card
        title="Police d'écriture"
        description="« Automatique » laisse chaque thème imposer la sienne."
      >
        <div className="grid gap-2 sm:grid-cols-2">
          {FONT_OPTIONS.map((font) => (
            <button
              key={font.id}
              type="button"
              onClick={() => set("fontFamily", font.id)}
              className={cn(
                "flex items-center gap-3 rounded-xl border p-3 text-left transition-colors",
                font.id === fontFamily
                  ? "border-brand bg-brand-subtle/50"
                  : "border-border hover:border-border-strong",
              )}
            >
              <span
                aria-hidden
                className="bg-muted grid size-9 shrink-0 place-items-center rounded-lg text-base"
                style={{ fontFamily: font.variable }}
              >
                Aa
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[0.8125rem] font-medium">{font.label}</span>
                <span className="text-muted-foreground block text-xs leading-snug">
                  {font.hint}
                </span>
              </span>
              {font.id === fontFamily && (
                <Icon icon={Tick02Icon} size={15} className="text-brand shrink-0" />
              )}
            </button>
          ))}
        </div>
      </Card>

      <Card title="Affichage">
        <Row label="Mode" hint="« Système » suit le réglage de votre appareil.">
          <SegmentedControl options={SCHEMES} value={scheme} onChange={setScheme} />
        </Row>
        <Row label="Taille du texte" hint="S'applique au fil de conversation.">
          <SegmentedControl
            options={SCALES}
            value={fontScale}
            onChange={(value) => set("fontScale", value)}
          />
        </Row>
      </Card>
    </>
  );
}
