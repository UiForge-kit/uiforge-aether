"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowDown01Icon } from "@hugeicons/core-free-icons";
import { AnimatePresence, motion } from "motion/react";
import { MessageBubble } from "@/components/chat/message-bubble";
import { Icon } from "@/components/icon";
import { ScrollRegion } from "@/components/layout/scroll-region";
import { Button } from "@/components/ui/button";
import { useChatStore } from "@/store/chat-store";
import { usePreferencesStore } from "@/store/preferences-store";
import type { Message } from "@/types/chat";

const STICKY_THRESHOLD_PX = 80;

interface ThreadProps {
  messages: Message[];
  children?: React.ReactNode;
}

export function Thread({ messages, children }: ThreadProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [atBottom, setAtBottom] = useState(true);
  const streamingMessageId = useChatStore((state) => state.streamingMessageId);
  const fontScale = usePreferencesStore((state) => state.fontScale);

  const last = messages[messages.length - 1];
  const signature = `${messages.length}:${last?.content.length ?? 0}:${streamingMessageId}`;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onScroll = () => {
      const distance = container.scrollHeight - container.scrollTop - container.clientHeight;
      setAtBottom(distance < STICKY_THRESHOLD_PX);
    };

    onScroll();
    container.addEventListener("scroll", onScroll, { passive: true });
    return () => container.removeEventListener("scroll", onScroll);
  }, []);

  // only follow the stream when already at the bottom, otherwise rereading
  // something above is impossible during a long answer
  useEffect(() => {
    if (!atBottom) return;
    const container = containerRef.current;
    container?.scrollTo({ top: container.scrollHeight });
    // atBottom stays out of the deps: only new content should scroll, not the flag update
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signature]);

  const scrollToBottom = useCallback(() => {
    const container = containerRef.current;
    container?.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
  }, []);

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <ScrollRegion ref={containerRef}>
        <div
          data-scale={fontScale}
          className="mx-auto w-full max-w-thread px-3 pt-4 pb-6 md:px-6"
        >
          {children}
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
        </div>
      </ScrollRegion>

      <AnimatePresence>
        {!atBottom && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center"
          >
            <Button
              variant="outline"
              size="icon-sm"
              onClick={scrollToBottom}
              aria-label="Revenir en bas"
              className="bg-surface shadow-pop pointer-events-auto rounded-full"
            >
              <Icon icon={ArrowDown01Icon} size={16} />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
