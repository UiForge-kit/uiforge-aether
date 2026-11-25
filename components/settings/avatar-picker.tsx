"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft01Icon, ArrowRight01Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { AnimatePresence, motion } from "motion/react";
import type { IconSvgElement } from "@hugeicons/react";
import { Icon } from "@/components/icon";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AVATAR_FAMILIES } from "@/lib/avatars";
import { cn } from "@/lib/utils";
 
export function AvatarPicker({
  open,
  onOpenChange,
  value,
  onSelect,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: string;
  onSelect: (id: string) => void;
}) {
  // SVGs are generated on mount, then memoized in `avatars.ts`
  const gallery = useMemo(
    () =>
      AVATAR_FAMILIES.map((family) => ({
        id: family.id,
        label: family.label,
        items: family.items.map((item) => ({ id: item.id, uri: item.render() })),
      })),
    [],
  );

  const currentFamily = gallery.find((family) => family.items.some((item) => item.id === value));

  const [tab, setTab] = useState(currentFamily?.id ?? gallery[0].id);
  const [index, setIndex] = useState(() =>
    Math.max(currentFamily?.items.findIndex((item) => item.id === value) ?? 0, 0),
  );
  const [direction, setDirection] = useState(1);

  // reset to the current avatar's family and position on every open: the dialog
  // stays mounted between opens (exit animation), so its state won't reset alone
  useEffect(() => {
    if (!open) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTab(currentFamily?.id ?? gallery[0].id);
    setIndex(Math.max(currentFamily?.items.findIndex((item) => item.id === value) ?? 0, 0));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const family = gallery.find((item) => item.id === tab);
  const items = family?.items ?? [];
  const active = items[index];

  const changeTab = (next: string) => {
    const nextFamily = gallery.find((item) => item.id === next);
    const valueIndex = nextFamily?.items.findIndex((item) => item.id === value) ?? -1;
    setDirection(1);
    setTab(next);
    setIndex(valueIndex >= 0 ? valueIndex : 0);
  };

  const step = (delta: 1 | -1) => {
    if (items.length === 0) return;
    setDirection(delta);
    setIndex((current) => (current + delta + items.length) % items.length);
  };

  const goTo = (nextIndex: number) => {
    setDirection(nextIndex > index ? 1 : -1);
    setIndex(nextIndex);
  };

  const choose = (id: string) => {
    onSelect(id);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm pb-8">
        <Tabs value={tab} onValueChange={(next) => changeTab(String(next))} className="pt-8">
          <TabsList className="w-full">
            {gallery.map((familyOption) => (
              <TabsTrigger key={familyOption.id} value={familyOption.id}>
                {familyOption.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="flex flex-col items-center gap-4 py-2">
          <div className="flex items-center gap-3">
            <NavButton icon={ArrowLeft01Icon} onClick={() => step(-1)} label="Illustration précédente" />

            <div className="bg-muted relative size-40 shrink-0 overflow-hidden rounded-3xl">
              <AnimatePresence initial={false}>
                {active && (
                  <motion.button
                    key={active.id}
                    type="button"
                    initial={{ x: direction > 0 ? 64 : -64, opacity: 0, scale: 0.9 }}
                    animate={{ x: 0, opacity: 1, scale: 1 }}
                    exit={{ x: direction > 0 ? -64 : 64, opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
                    onClick={() => choose(active.id)}
                    aria-label={`${family?.label} ${active.id.split(":")[1]}`}
                    aria-pressed={value === active.id}
                    className="absolute inset-0 grid place-items-center"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={active.uri} alt="" className="size-full" />
                    {value === active.id && <SelectedBadge />}
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            <NavButton icon={ArrowRight01Icon} onClick={() => step(1)} label="Illustration suivante" />
          </div>

          {items.length > 0 && (
            <div className="flex items-center gap-1.5">
              {items.map((item, itemIndex) => (
                <button
                  key={item.id}
                  type="button"
                  aria-label={`Aller à l'illustration ${itemIndex + 1}`}
                  onClick={() => goTo(itemIndex)}
                  className={cn(
                    "h-1.5 rounded-full transition-all",
                    itemIndex === index ? "bg-brand w-4" : "bg-border w-1.5",
                  )}
                />
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function SelectedBadge() {
  return (
    <span className="bg-brand text-brand-foreground pointer-events-none absolute right-2 bottom-2 grid size-6 place-items-center rounded-full">
      <Icon icon={Tick02Icon} size={13} strokeWidth={3} />
    </span>
  );
}

function NavButton({
  icon,
  onClick,
  label,
}: {
  icon: IconSvgElement;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="border-border bg-surface hover:border-border-strong hover:bg-muted grid size-9 shrink-0 place-items-center rounded-full border transition-colors"
    >
      <Icon icon={icon} size={16} />
    </button>
  );
}
