import { LockKeyIcon } from "@hugeicons/core-free-icons";
import { Icon } from "@/components/icon";
import { Button } from "@/components/ui/button";
import { SITE } from "@/config/site";

export const PRO_LOCKED_COPY = {
  badge: "Pro",
  title: "Disponible en Pro",
  cta: "Découvrir l'offre Pro",
} as const;

// http(s) only, the URL comes from an env var
const upgradeUrl = /^https?:\/\//.test(SITE.upgrade.url) ? SITE.upgrade.url : "";

interface ProLockedProps {
  feature: string;
  description?: string;
}

export function ProLocked({ feature, description }: ProLockedProps) {
  return (
    <section
      aria-label={`${feature} : ${PRO_LOCKED_COPY.title}`}
      className="border-border bg-surface mx-auto flex w-full max-w-lg flex-col items-center rounded-2xl border px-6 py-10 text-center"
    >
      <span className="bg-brand-subtle text-brand mb-4 grid size-12 place-items-center rounded-2xl">
        <Icon icon={LockKeyIcon} size={22} />
      </span>
      <p className="label-caps">{PRO_LOCKED_COPY.title}</p>
      <h2 className="font-display mt-1 text-xl font-semibold tracking-tight">{feature}</h2>
      {description && (
        <p className="text-muted-foreground mt-2 max-w-sm text-[0.9375rem] leading-relaxed">
          {description}
        </p>
      )}
      {upgradeUrl && (
        <Button
          className="mt-6"
          render={<a href={upgradeUrl} target="_blank" rel="noopener noreferrer" />}
        >
          {PRO_LOCKED_COPY.cta}
        </Button>
      )}
    </section>
  );
}
