import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { AppPath } from "@/lib/nav-content";

export function Container({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-[1240px] px-5 sm:px-8", className)}>{children}</div>
  );
}

export function Section({
  className,
  children,
  id,
}: {
  className?: string;
  children: ReactNode;
  id?: string;
}) {
  return (
    <section id={id} className={cn("py-20 sm:py-28", className)}>
      {children}
    </section>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.14em] text-brand uppercase">
      <span className="inline-block h-px w-6 bg-brand" />
      {children}
    </p>
  );
}

export function SectionTitle({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={cn(
        "mt-5 max-w-3xl text-[1.75rem] leading-[1.35] font-bold sm:text-4xl sm:leading-[1.3]",
        className,
      )}
    >
      {children}
    </h2>
  );
}

export function Lead({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn("mt-5 max-w-2xl text-base leading-8 text-muted-foreground", className)}>
      {children}
    </p>
  );
}

const base =
  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand";

export function CtaLink({
  to,
  children,
  variant = "primary",
  className,
}: {
  to: AppPath;
  children: ReactNode;
  variant?: "primary" | "outline" | "ghost";
  className?: string;
}) {
  return (
    <Link
      to={to}
      className={cn(
        base,
        variant === "primary" && "h-11 bg-brand px-6 text-brand-foreground hover:bg-brand/90",
        variant === "outline" &&
          "h-11 border border-border px-6 text-foreground hover:border-foreground/40 hover:bg-secondary",
        variant === "ghost" && "text-foreground hover:text-brand",
        className,
      )}
    >
      {children}
      {variant === "ghost" && <ArrowLeft className="size-4" />}
    </Link>
  );
}

export function TextLink({
  to,
  children,
  className,
}: {
  to: AppPath;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      to={to}
      className={cn(
        "group inline-flex items-center gap-2 text-sm font-semibold text-foreground",
        className,
      )}
    >
      <span className="brand-underline">{children}</span>
      <ArrowLeft className="size-4 text-brand transition-transform group-hover:-translate-x-1 rtl:group-hover:-translate-x-1" />
    </Link>
  );
}
