"use client";

import Link from "next/link";
import { Menu01Icon, SidebarLeft01Icon } from "@hugeicons/core-free-icons";
import { Icon } from "@/components/icon";
import { UpgradeCta } from "@/components/topbar/upgrade-cta";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { IncognitoToggle } from "@/modules/incognito";
import { ShareButton } from "@/modules/share";
import { useUIStore } from "@/store/ui-store";

interface TopbarProps {
  title: string;
  section?: string;
  sectionHref?: string;
  onToggleSidebar?: () => void;
  actions?: React.ReactNode;
}

export function Topbar({ title, section, sectionHref, onToggleSidebar, actions }: TopbarProps) {
  const setMobileNav = useUIStore((state) => state.setMobileNav);

  return (
    // overlay above the scroll area, not a row of the column: that is what lets
    // content pass behind the bubbles. Gaps let wheel and clicks through
    <header className="pointer-events-none absolute inset-x-0 top-0 z-20 flex h-(--topbar-height) items-center gap-2 px-3 md:px-4">
      <div className="glass-pill pointer-events-auto flex shrink-0 items-center gap-0.5 rounded-full p-1">
        <Button
          variant="ghost"
          size="icon-sm"
          className="rounded-full md:hidden"
          onClick={() => setMobileNav(true)}
          aria-label="Ouvrir la navigation"
        >
          <Icon icon={Menu01Icon} size={18} />
        </Button>

        {onToggleSidebar && (
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="hidden rounded-full md:inline-flex"
                  onClick={onToggleSidebar}
                />
              }
              aria-label="Replier la barre latérale"
            >
              <Icon icon={SidebarLeft01Icon} size={17} />
            </TooltipTrigger>
            <TooltipContent className="gap-2">
              Replier la barre latérale
              <Kbd keys={["mod", "B"]} className="opacity-80" />
            </TooltipContent>
          </Tooltip>
        )}
      </div>

      <div className="glass-pill pointer-events-auto flex min-w-0 items-center gap-1.5 rounded-full px-3.5 py-1.5">
        {section && (
          <>
            {sectionHref ? (
              <Link
                href={sectionHref}
                className="text-muted-foreground hover:text-foreground hidden max-w-40 truncate text-sm transition-colors sm:inline"
              >
                {section}
              </Link>
            ) : (
              <span className="text-muted-foreground hidden text-sm sm:inline">{section}</span>
            )}
            <span className="text-muted-foreground/60 hidden text-sm sm:inline">/</span>
          </>
        )}
        <h1 className="truncate text-sm font-medium">{title}</h1>
      </div>

      <div className="glass-pill pointer-events-auto ml-auto flex shrink-0 items-center gap-1 rounded-full p-1">
        {actions}

        <IncognitoToggle />

        <UpgradeCta className="ml-0.5" />
        <ShareButton resource={title} />
      </div>
    </header>
  );
}
