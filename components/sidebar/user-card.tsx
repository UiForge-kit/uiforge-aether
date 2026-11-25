"use client";

import Link from "next/link";
import {
  ArrowDown01Icon,
  Download04Icon,
  HelpCircleIcon,
  LanguageSkillIcon,
  Logout01Icon,
  Moon02Icon,
  PaintBoardIcon,
  RepeatIcon,
  Rocket01Icon,
  Settings01Icon,
  Sun03Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { Icon } from "@/components/icon";
import { Swatch } from "@/components/theme/swatch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Kbd } from "@/components/ui/kbd";
import { UserAvatar } from "@/components/user/user-avatar";
import { MODULES } from "@/config/modules";
import { LANGUAGES, getLanguage } from "@/config/languages";
import { THEMES, getTheme } from "@/config/themes";
import { MOCK_USER } from "@/lib/mock/user";
import { cn } from "@/lib/utils";
import { useChatStore } from "@/store/chat-store";
import { usePreferencesStore } from "@/store/preferences-store";
import { useThemeStore } from "@/store/theme-store";
import { PLAN_LABELS } from "@/types/plan";
import type { ColorScheme } from "@/types/theme";

const SCHEMES: Array<{ value: ColorScheme; label: string }> = [
  { value: "light", label: "Clair" },
  { value: "dark", label: "Sombre" },
  { value: "system", label: "Auto" },
];

export function UserCard() {
  const resetDemo = useChatStore((state) => state.resetDemo);
  const { themeId, scheme, setTheme, setScheme } = useThemeStore();
  const { language, set } = usePreferencesStore();
  const activeLanguage = getLanguage(language);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            type="button"
            className="border-border bg-surface hover:border-border-strong flex w-full items-center gap-2.5 rounded-xl border p-2 text-left transition-colors"
          />
        }
      >
        <UserAvatar />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[0.8125rem] leading-tight font-medium">
            {MOCK_USER.name}
          </span>
          <span className="text-muted-foreground block truncate text-[0.6875rem] leading-tight">
            Plan {PLAN_LABELS[MOCK_USER.plan]}
          </span>
        </span>
        <Icon icon={ArrowDown01Icon} size={15} className="text-muted-foreground" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" side="top" sideOffset={8} className="w-64">
        <div className="px-1.5 py-1.5">
          <p className="text-sm font-medium">{MOCK_USER.name}</p>
          <p className="text-muted-foreground truncate text-xs">{MOCK_USER.email}</p>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuLabel>Apparence</DropdownMenuLabel>
          <div className="flex gap-1 px-1 pb-1">
            {SCHEMES.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={(event) => {
                  event.preventDefault();
                  setScheme(option.value);
                }}
                className={cn(
                  "flex h-8 flex-1 items-center justify-center gap-1.5 rounded-md text-xs font-medium transition-colors",
                  scheme === option.value
                    ? "bg-secondary text-secondary-foreground"
                    : "text-muted-foreground hover:bg-muted",
                )}
              >
                {option.value === "light" && <Icon icon={Sun03Icon} size={14} />}
                {option.value === "dark" && <Icon icon={Moon02Icon} size={14} />}
                {option.label}
              </button>
            ))}
          </div>
        </DropdownMenuGroup>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Icon icon={PaintBoardIcon} size={15} />
            <span className="flex-1">Thème</span>
            <span className="text-muted-foreground text-xs">{getTheme(themeId).name}</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="w-72">
            {THEMES.map((theme) => (
              <DropdownMenuItem
                key={theme.id}
                onClick={() => setTheme(theme.id)}
                className="items-start gap-2.5 py-2"
              >
                <Swatch colors={theme.swatch} className="mt-0.5" />
                <span className="flex-1">
                  <span className="block font-medium">{theme.name}</span>
                  <span className="text-muted-foreground block text-xs leading-snug">
                    {theme.description}
                  </span>
                </span>
                {theme.id === themeId && (
                  <Icon icon={Tick02Icon} size={15} className="text-brand mt-0.5" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Icon icon={LanguageSkillIcon} size={15} />
            <span className="flex-1">Langue</span>
            <span className="text-muted-foreground text-xs">{activeLanguage.flag}</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="w-60">
            {LANGUAGES.map((option) => (
              <DropdownMenuItem
                key={option.id}
                onClick={() => set("language", option.id)}
                className="gap-2.5 py-1.5"
              >
                <span aria-hidden>{option.flag}</span>
                <span className="flex-1">
                  <span className="block">{option.label}</span>
                  <span className="text-muted-foreground block text-xs leading-snug">
                    {option.region}
                  </span>
                </span>
                {option.id === language && (
                  <Icon icon={Tick02Icon} size={15} className="text-brand" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSeparator />

        <DropdownMenuItem render={<Link href="/settings" />}>
          <Icon icon={Settings01Icon} size={15} />
          <span className="flex-1">Paramètres</span>
          <Kbd keys={["mod", ","]} />
        </DropdownMenuItem>
        {MODULES.map(
          (module) =>
            module.nav?.userMenu &&
            module.href && (
              <DropdownMenuItem key={module.id} render={<Link href={module.href} />}>
                <Icon icon={module.nav.icon} size={15} />
                {module.label}
              </DropdownMenuItem>
            ),
        )}

        <DropdownMenuSeparator />

        <DropdownMenuItem render={<Link href="/settings?section=facturation" />}>
          <Icon icon={Rocket01Icon} size={15} />
          Mettre à niveau l&apos;abonnement
        </DropdownMenuItem>
        <DropdownMenuItem render={<Link href="/settings?section=raccourcis" />}>
          <Icon icon={HelpCircleIcon} size={15} />
          Obtenir de l&apos;aide
        </DropdownMenuItem>
        <DropdownMenuItem disabled>
          <Icon icon={Download04Icon} size={15} />
          <span className="flex-1">Télécharger l&apos;application</span>
          <span className="text-muted-foreground text-[0.6875rem]">Bientôt</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => void resetDemo()}>
          <Icon icon={RepeatIcon} size={15} />
          Réinitialiser la démo
        </DropdownMenuItem>
        <DropdownMenuItem disabled>
          <Icon icon={Logout01Icon} size={15} />
          Déconnexion
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
