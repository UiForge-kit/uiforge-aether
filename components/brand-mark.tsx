import { cn } from "@/lib/utils";

// same path as the docs-site `.brand-mark` badge, keep both in sync
export function BrandMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "brand-mark text-brand-foreground grid size-8 shrink-0 place-items-center rounded-lg",
        className,
      )}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-1/2"
        aria-hidden
      >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    </span>
  );
}
