import { cn } from "@/lib/utils";

/**
 * RYCODE wordmark. RY = graphite (warm white on dark), CODE = orange.
 * Placeholder until the official logo file is provided.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <span
      dir="ltr"
      className={cn(
        "font-display inline-flex select-none items-center text-[1.35rem] font-extrabold tracking-[-0.04em] leading-none",
        className,
      )}
    >
      <span className="text-foreground">RY</span>
      <span className="text-brand">CODE</span>
    </span>
  );
}

export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-grid size-8 place-items-center rounded-[4px] bg-brand text-[0.9rem] font-extrabold text-brand-foreground",
        className,
      )}
    >
      R
    </span>
  );
}
