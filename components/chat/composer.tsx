"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowUp01Icon, Mic01Icon, StopIcon } from "@hugeicons/core-free-icons";
import { AnimatePresence, motion } from "motion/react";
import { AttachmentChip } from "@/components/chat/attachment-chip";
import { ComposerToolButtons } from "@/components/chat/composer-tool-buttons";
import { Icon } from "@/components/icon";
import { ModelSelector } from "@/components/topbar/model-selector";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { getModel } from "@/config/models";
import { cn } from "@/lib/utils";
import { useChatStore } from "@/store/chat-store";
import { useComposerStore } from "@/store/composer-store";
import { usePreferencesStore } from "@/store/preferences-store";

const MAX_TEXTAREA_HEIGHT = 208;

interface ComposerProps {
  conversationId?: string;
  autoFocus?: boolean;
  hint?: React.ReactNode;
  variant?: "default" | "centered";
}

export function Composer({ conversationId, autoFocus, hint, variant = "default" }: ComposerProps) {
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const sendBehavior = usePreferencesStore((state) => state.sendBehavior);

  const { input, modelId, attachments, enabledTools, setInput, toggleTool, addAttachments, removeAttachment, clear } =
    useComposerStore();
  const { sendMessage, stopStreaming, streamingMessageId, createConversation } = useChatStore();

  const streaming = streamingMessageId !== null;
  const canSend = input.trim().length > 0 && !streaming;
  const capabilities = getModel(modelId).capabilities;

  useEffect(() => {
    const element = textareaRef.current;
    if (!element) return;
    element.style.height = "auto";
    element.style.height = `${Math.min(element.scrollHeight, MAX_TEXTAREA_HEIGHT)}px`;
  }, [input]);

  useEffect(() => {
    if (autoFocus) textareaRef.current?.focus();
  }, [autoFocus]);

  const submit = () => {
    if (!canSend) return;

    // from home, create the conversation before sending so the URL carries its
    // id from the first message
    const target = conversationId ?? createConversation(modelId);
    const payload = {
      content: input,
      attachments,
      modelId,
      tools: enabledTools,
      conversationId: target,
    };

    clear();
    if (!conversationId) router.replace(`/c/${target}`);
    void sendMessage(payload);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== "Enter" || event.nativeEvent.isComposing) return;

    // mobile keyboards expose no modifier, so the button stays the only reliable send
    const shouldSend =
      sendBehavior === "enter"
        ? !event.shiftKey
        : event.metaKey || event.ctrlKey;

    if (shouldSend) {
      event.preventDefault();
      submit();
    }
  };

  const onPaste = (event: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const files = Array.from(event.clipboardData.files);
    if (files.length > 0) {
      event.preventDefault();
      addAttachments(files);
    }
  };

  return (
    <div
      className={cn(
        variant === "default" && "bg-canvas/85 sticky bottom-0 z-10 pb-3 backdrop-blur-md md:pb-5",
      )}
    >
      <div
        className={cn(
          "mx-auto w-full px-3 md:px-6",
          variant === "centered" ? "max-w-3xl" : "max-w-thread",
        )}
      >
        <div className="border-border bg-surface shadow-pop focus-within:border-border-strong rounded-2xl border transition-colors overflow-hidden">
          <AnimatePresence initial={false}>
            {attachments.length > 0 && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="flex flex-wrap gap-1.5 px-3 pt-3">
                  {attachments.map((attachment) => (
                    <AttachmentChip
                      key={attachment.id}
                      attachment={attachment}
                      onRemove={removeAttachment}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <textarea
            ref={textareaRef}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={onKeyDown}
            onPaste={onPaste}
            rows={1}
            placeholder="Posez votre question…"
            aria-label="Message"
            className="scrollbar-slim placeholder:text-muted-foreground w-full resize-none bg-transparent px-4 pt-3.5 pb-2 text-[0.9375rem] leading-relaxed outline-none"
          />

          <div className="flex items-center gap-0.5 px-2 pb-2">
            <ComposerToolButtons
              capabilities={capabilities}
              enabled={enabledTools}
              onToggle={toggleTool}
              onPickFiles={addAttachments}
            />

            <span className="bg-border mx-1 h-4 w-px" aria-hidden />

            {/* model is picked per message, so here and not in the topbar */}
            <ModelSelector variant="compact" />

            <div className="ml-auto flex items-center gap-1.5">
              <Tooltip>
                <TooltipTrigger
                  render={
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => router.push("/voice")}
                    />
                  }
                  aria-label="Mode vocal"
                >
                  <Icon icon={Mic01Icon} size={16} />
                </TooltipTrigger>
                <TooltipContent className="gap-2">
                  Mode vocal
                  <Kbd keys={["mod", "⇧", "V"]} className="opacity-80" />
                </TooltipContent>
              </Tooltip>

              <span className="text-muted-foreground mr-0.5 hidden text-[0.6875rem] lg:block">
                {sendBehavior === "enter" ? "Entrée" : "Ctrl + Entrée"} pour envoyer
              </span>

              {streaming ? (
                <Button
                  size="icon"
                  variant="secondary"
                  onClick={stopStreaming}
                  aria-label="Arrêter la génération"
                >
                  <Icon icon={StopIcon} size={16} strokeWidth={2} />
                </Button>
              ) : (
                <Button
                  size="icon"
                  onClick={submit}
                  disabled={!canSend}
                  aria-label="Envoyer le message"
                >
                  <Icon icon={ArrowUp01Icon} size={17} strokeWidth={2.2} />
                </Button>
              )}
            </div>
          </div>
        </div>

        <p className="text-muted-foreground mt-2 text-center text-[0.6875rem]">
          {hint ?? "L'assistant peut faire des erreurs. Vérifiez les informations importantes."}
        </p>
      </div>
    </div>
  );
}
