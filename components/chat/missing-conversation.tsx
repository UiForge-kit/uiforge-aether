"use client";

import Link from "next/link";
import { FileSearchIcon, Home01Icon, PlusSignIcon } from "@hugeicons/core-free-icons";
import { motion } from "motion/react";
import { Icon } from "@/components/icon";
import { Button } from "@/components/ui/button";

export function MissingConversation({ conversationId }: { conversationId: string }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-16 text-center">
      <motion.span
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="bg-muted text-muted-foreground mb-5 grid size-14 place-items-center rounded-2xl"
      >
        <Icon icon={FileSearchIcon} size={26} />
      </motion.span>

      <h2 className="font-display text-xl font-semibold tracking-tight md:text-2xl">
        Cette conversation n&apos;existe plus
      </h2>
      <p className="text-muted-foreground mt-2 max-w-md text-[0.9375rem] leading-relaxed">
        Elle a été supprimée, ou le stockage de cet appareil a été vidé. Les
        conversations de ce template vivent dans le navigateur : elles ne suivent
        pas d&apos;un appareil à l&apos;autre.
      </p>

      <code className="bg-muted text-muted-foreground mt-4 rounded-md px-2 py-1 font-mono text-[0.6875rem]">
        {conversationId}
      </code>

      <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
        <Button render={<Link href="/" replace />}>
          <Icon icon={PlusSignIcon} size={16} strokeWidth={2} />
          Nouvelle conversation
        </Button>
        <Button variant="outline" render={<Link href="/projects" />}>
          <Icon icon={Home01Icon} size={16} />
          Voir mes projets
        </Button>
      </div>
    </div>
  );
}
