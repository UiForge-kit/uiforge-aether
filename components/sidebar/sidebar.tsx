"use client";

import { useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { MessageMultiple01Icon, PlusSignIcon, Search01Icon } from "@hugeicons/core-free-icons";
import { AnimatePresence, motion } from "motion/react";
import { BrandMark } from "@/components/brand-mark";
import { Icon } from "@/components/icon";
import { ConversationItem } from "@/components/sidebar/conversation-item";
import { UserCard } from "@/components/sidebar/user-card";
import { EDITION_LABEL } from "@/config/edition";
import {
  Accordion,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PRO_LOCKED_COPY } from "@/components/pro/pro-locked";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { modulesIn, type ModuleDef } from "@/config/modules";
import { SITE } from "@/config/site";
import { groupConversations } from "@/lib/date";
import { cn } from "@/lib/utils";
import { useChatStore } from "@/store/chat-store";
import { useUIStore } from "@/store/ui-store";

export function Sidebar() {
  const router = useRouter();
  const { conversations, activeId, hydrated } = useChatStore();
  const { setMobileNav, setCommandOpen } = useUIStore();

  const groups = useMemo(() => groupConversations(conversations), [conversations]);

  // home acts as the blank conversation, the thread is only created on the
  // first message
  const startNew = () => {
    setMobileNav(false);
    router.push("/");
  };

  return (
    <div className="bg-surface flex h-full flex-col">
      <div className="flex items-center gap-2.5 px-3 pt-3.5 pb-3">
        <BrandMark />
        <span className="min-w-0 flex-1">
          <span className="font-display block truncate text-sm leading-tight font-semibold">
            {SITE.name}
          </span>
          <span className="text-muted-foreground block truncate text-[0.6875rem] leading-tight">
            {EDITION_LABEL}
          </span>
        </span>

        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant="ghost"
                size="icon-sm"
                className="shrink-0"
                onClick={() => setCommandOpen(true)}
              />
            }
            aria-label="Rechercher une conversation"
          >
            <Icon icon={Search01Icon} size={16} />
          </TooltipTrigger>
          <TooltipContent className="gap-2">
            Rechercher
            <Kbd keys={["mod", "F"]} className="opacity-80" />
          </TooltipContent>
        </Tooltip>
      </div>

      <div className="px-3 pb-2">
        <Button onClick={startNew} className="group h-9 w-full justify-start gap-2 px-2.5">
          <Icon icon={PlusSignIcon} size={16} strokeWidth={2} />
          <span className="flex-1 text-left">Nouvelle conversation</span>
          <Kbd
            keys={["mod", "K"]}
            className="opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 [&>kbd]:border-primary-foreground/25 [&>kbd]:bg-primary-foreground/15 [&>kbd]:text-primary-foreground/80"
          />
        </Button>
      </div>

      <nav className="flex min-h-0 flex-1 flex-col space-y-0.5 px-3 pb-2">
        {modulesIn("primary").map((module) => (
          <NavLink key={module.id} module={module} />
        ))}

        <Accordion defaultValue={["discussions"]} className="flex min-h-0 flex-1 flex-col">
          <AccordionItem value="discussions" className="flex min-h-0 flex-1 flex-col">
            <AccordionTrigger className="text-foreground/85 hover:bg-muted h-9 shrink-0 gap-2 rounded-lg px-2 text-[0.8125rem] font-normal">
              <span className="flex flex-1 items-center gap-2">
                <Icon icon={MessageMultiple01Icon} size={16} className="text-muted-foreground" />
                Discussions
              </span>
            </AccordionTrigger>

            <AccordionPanel scrollable>
              {!hydrated ? (
                <div className="space-y-2 pt-2">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <Skeleton key={index} className="h-9 w-full rounded-lg" />
                  ))}
                </div>
              ) : groups.length === 0 ? (
                <p className="text-muted-foreground px-1 py-6 text-center text-xs">
                  Aucune conversation pour l&apos;instant.
                </p>
              ) : (
                <div className="space-y-px pt-2">
                  <AnimatePresence initial={false}>
                    {groups
                      .flatMap((group) => group.items)
                      .map((conversation) => (
                        <motion.div
                          key={conversation.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <ConversationItem
                            conversation={conversation}
                            active={conversation.id === activeId}
                          />
                        </motion.div>
                      ))}
                  </AnimatePresence>
                </div>
              )}
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </nav>

      <div className="border-border space-y-1 border-t p-3">
        {modulesIn("footer").map((module) => (
          <NavLink key={module.id} module={module} />
        ))}
        <UserCard />
      </div>
    </div>
  );
}

function NavLink({ module }: { module: ModuleDef }) {
  const pathname = usePathname();
  const setMobileNav = useUIStore((state) => state.setMobileNav);
  const href = module.href;
  if (!href || !module.nav) return null;

  const active = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      onClick={() => setMobileNav(false)}
      className={cn(
        "flex h-9 items-center gap-2 rounded-lg px-2 text-[0.8125rem] transition-colors",
        active
          ? "bg-secondary text-secondary-foreground font-medium"
          : "text-foreground/85 hover:bg-muted",
      )}
    >
      <Icon icon={module.nav.icon} size={16} className="text-muted-foreground" />
      <span className="flex-1">{module.label}</span>
      {module.locked && (
        <Badge variant="secondary" className="h-4 px-1.5 text-[0.625rem]">
          {PRO_LOCKED_COPY.badge}
        </Badge>
      )}
    </Link>
  );
}
