"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search01Icon } from "@hugeicons/core-free-icons";
import { AnimatePresence, motion } from "motion/react";
import { Icon } from "@/components/icon";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Kbd } from "@/components/ui/kbd";
import { formatRelative, groupConversations } from "@/lib/date";
import { cn } from "@/lib/utils";
import { useChatStore } from "@/store/chat-store";
import { useUIStore } from "@/store/ui-store";
import type { Conversation } from "@/types/chat";

export function CommandSearch() {
  const { commandOpen, setCommandOpen } = useUIStore();

  return (
    <Dialog open={commandOpen} onOpenChange={setCommandOpen}>
      <DialogContent
        showCloseButton={false}
        className="top-[18%] translate-y-0 gap-0 overflow-hidden p-0 sm:max-w-xl"
      >
        <DialogTitle className="sr-only">Rechercher une conversation</DialogTitle>
        {/* unmounted by the primitive on close, so search starts fresh */}
        <SearchPanel onNavigate={() => setCommandOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}

function SearchPanel({ onNavigate }: { onNavigate: () => void }) {
  const router = useRouter();
  const { conversations, activeId, setActive } = useChatStore();
  const setMobileNav = useUIStore((state) => state.setMobileNav);

  const [query, setQuery] = useState("");

  const groups = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const filtered = needle
      ? conversations.filter(
          (conversation) =>
            conversation.title.toLowerCase().includes(needle) ||
            conversation.preview.toLowerCase().includes(needle),
        )
      : conversations;
    return groupConversations(filtered);
  }, [conversations, query]);

  const open = (id: string) => {
    setActive(id);
    onNavigate();
    setMobileNav(false);
    router.push(`/c/${id}`);
  };

  return (
    <>
      <div className="border-border flex items-center gap-2.5 border-b px-4">
        <Icon icon={Search01Icon} size={17} className="text-muted-foreground shrink-0" />
        <input
          autoFocus
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Rechercher une conversation…"
          aria-label="Rechercher une conversation"
          className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
        <Kbd keys={["Échap"]} className="text-muted-foreground shrink-0 opacity-70" />
      </div>

      <div className="scrollbar-slim max-h-[60vh] overflow-y-auto p-2">
        {groups.length === 0 ? (
          <p className="text-muted-foreground px-2 py-10 text-center text-sm">
            {query ? "Aucun résultat." : "Aucune conversation pour l'instant."}
          </p>
        ) : (
          <AnimatePresence initial={false}>
            {groups.map((group) => (
              <motion.section
                key={group.label}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <h2 className="label-caps px-2 pt-2 pb-1.5">{group.label}</h2>
                <div className="space-y-0.5">
                  {group.items.map((conversation) => (
                    <ResultRow
                      key={conversation.id}
                      conversation={conversation}
                      active={conversation.id === activeId}
                      onClick={() => open(conversation.id)}
                    />
                  ))}
                </div>
              </motion.section>
            ))}
          </AnimatePresence>
        )}
      </div>
    </>
  );
}

function ResultRow({
  conversation,
  active,
  onClick,
}: {
  conversation: Conversation;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-baseline gap-3 rounded-lg px-2.5 py-2 text-left transition-colors",
        active ? "bg-secondary" : "hover:bg-muted",
      )}
    >
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[0.8125rem] font-medium">{conversation.title}</span>
        {conversation.preview && (
          <span className="text-muted-foreground mt-0.5 block truncate text-xs">
            {conversation.preview}
          </span>
        )}
      </span>
      <span className="text-muted-foreground shrink-0 text-[0.6875rem]">
        {formatRelative(conversation.updatedAt)}
      </span>
    </button>
  );
}
