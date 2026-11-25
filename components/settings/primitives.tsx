import { cn } from "@/lib/utils";


export function Card({
  title,
  description,
  action,
  children,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="surface-card p-4 md:p-5">
      <header className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-medium">{title}</h3>
          {description && (
            <p className="text-muted-foreground mt-0.5 text-xs leading-snug">{description}</p>
          )}
        </div>
        {action}
      </header>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export function Row({
  label,
  hint,
  children,
  align = "center",
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
  align?: "center" | "start";
}) {
  return (
    <div
      className={cn(
        "border-border flex gap-4 border-b py-3 first:pt-0 last:border-0 last:pb-0",
        align === "center" ? "items-center" : "items-start",
      )}
    >
      <div className="min-w-0 flex-1">
        <p className="text-[0.8125rem]">{label}</p>
        {hint && <p className="text-muted-foreground mt-0.5 text-xs leading-snug">{hint}</p>}
      </div>
      {children}
    </div>
  );
}

export function Labelled({
  label,
  hint,
  children,
  className,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1 flex items-baseline gap-2">
        <span className="text-[0.8125rem] font-medium">{label}</span>
        {hint && <span className="text-muted-foreground text-xs">{hint}</span>}
      </span>
      {children}
    </label>
  );
}
