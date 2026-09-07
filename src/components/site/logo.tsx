import { cn } from "@/lib/utils";
import logoAsset from "@/assets/rycode-logo.png.asset.json";

/**
 * RYCODE logo: official mark + wordmark (RY graphite, CODE orange).
 */
export function Logo({ className }: { className?: string }) {
  return (
    <span dir="ltr" className={cn("inline-flex select-none items-center gap-2", className)}>
      <img src={logoAsset.url} alt="RYCODE" className="h-[1.4em] w-auto" />
      <span className="font-display text-[1.35rem] font-extrabold leading-none tracking-[-0.04em]">
        <span className="text-foreground">RY</span>
        <span className="text-brand">CODE</span>
      </span>
    </span>
  );
}

export function LogoMark({ className }: { className?: string }) {
  return (
    <img
      src={logoAsset.url}
      alt="RYCODE"
      className={cn("size-8 object-contain", className)}
      aria-hidden
    />
  );
}
