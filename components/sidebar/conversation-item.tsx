"use client";

import { useRouter } from "next/navigation";
import {
  Delete02Icon,
  Edit02Icon,
  MoreHorizontalIcon,
  PinIcon,
} from "@hugeicons/core-free-icons";
import { motion } from "motion/react";
import { Icon } from "@/components/icon";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useChatStore } from "@/store/chat-store";
import { useUIStore } from "@/store/ui-store";
import type { Conversation } from "@/types/chat";

interface ConversationItemProps {
  conversation: Conversation;
  active: boolean;
}

export function ConversationItem({ conversation, active }: ConversationItemProps) {
  const router = useRouter();
  const { renameConversation, togglePin, deleteConversation, setActive } = useChatStore();
  const closeMobileNav = useUIStore((state) => state.setMobileNav);

  const open = () => {
    setActive(conversation.id);
    closeMobileNav(false);
    router.push(`/c/${conversation.id}`);
  };

  const rename = () => {
    const next = window.prompt("Nouveau titre", conversation.title);
    if (next) void renameConversation(conversation.id, next);
  };

  const remove = () => {
    void deleteConversation(conversation.id);
    if (active) router.push("/");
  };

  return (
    <div
      className={cn(
        "group relative flex items-center rounded-lg transition-colors",
        active ? "bg-secondary" : "hover:bg-muted",
      )}
    >
      {active && (
        <motion.span
          layoutId="conversation-marker"
          className="bg-brand absolute top-1/2 -left-2 h-4 w-[3px] -translate-y-1/2 rounded-full"
          transition={{ type: "spring", stiffness: 420, damping: 34 }}
        />
      )}

      <button
        type="button"
        onClick={open}
        className="min-w-0 flex-1 px-2.5 py-2 text-left outline-none"
      >
        <span
          className={cn(
            "block truncate text-[0.8125rem] leading-5",
            active ? "text-foreground font-medium" : "text-foreground/85",
          )}
        >
          {conversation.title}
        </span>
      </button>

      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon-xs"
              className="mr-1.5 opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100 data-popup-open:opacity-100"
            />
          }
          aria-label="Actions sur la conversation"
        >
          <Icon icon={MoreHorizontalIcon} size={14} />
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuItem onClick={rename}>
            <Icon icon={Edit02Icon} size={15} />
            Renommer
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => void togglePin(conversation.id)}>
            <Icon icon={PinIcon} size={15} />
            {conversation.pinned ? "Détacher" : "Épingler"}
          </DropdownMenuItem>
          <DropdownMenuItem variant="destructive" onClick={remove}>
            <Icon icon={Delete02Icon} size={15} />
            Supprimer
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
