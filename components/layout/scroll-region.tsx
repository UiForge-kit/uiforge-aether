import { cn } from "@/lib/utils";

// content fades over the topbar height. Black is the mask's alpha channel,
// not a rendered color
const TOPBAR_FADE = {
  maskImage: "linear-gradient(to bottom, transparent, #000 var(--topbar-height))",
  WebkitMaskImage: "linear-gradient(to bottom, transparent, #000 var(--topbar-height))",
} satisfies React.CSSProperties;

// the topbar is an overlay, not a row of the column: without reserved height
// here the first screen is born hidden behind it
export function ScrollRegion({ className, style, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      style={{ ...TOPBAR_FADE, ...style }}
      className={cn(
        "scrollbar-slim min-h-0 flex-1 overflow-x-hidden overflow-y-auto pt-(--topbar-height)",
        className,
      )}
      {...props}
    />
  );
}
