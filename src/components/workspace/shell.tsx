import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import type { NavGroup } from "@/lib/workspace/nav";
import { Logo } from "@/components/site/logo";

export function WorkspaceShell({
  nav,
  area,
  areaLabel,
  children,
}: {
  nav: NavGroup[];
  area: "dashboard" | "admin";
  areaLabel: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/login", replace: true });
  }

  const sidebar = (
    <nav className="flex h-full flex-col gap-6 overflow-y-auto px-4 py-6">
      <div className="flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Logo className="h-7 w-auto" />
        </Link>
        <span className="rounded-md border border-border px-2 py-0.5 text-[11px] text-muted-foreground">
          {areaLabel}
        </span>
      </div>

      {nav.map((group, index) => (
        <div key={group.label ?? index} className="space-y-1">
          {group.label && (
            <p className="px-2 pb-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              {group.label}
            </p>
          )}
          {group.items.map((item) => (
            <Link
              key={String(item.to)}
              to={item.to}
              activeOptions={{ exact: Boolean(item.exact) }}
              onClick={() => setOpen(false)}
              className="block rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground data-[status=active]:bg-muted data-[status=active]:font-medium data-[status=active]:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </div>
      ))}

      <div className="mt-auto space-y-1 border-t border-border pt-4">
        {area === "dashboard" ? (
          <Link
            to="/"
            className="block rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            بازگشت به وب‌سایت
          </Link>
        ) : (
          <Link
            to="/dashboard"
            className="block rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            پنل مشتری
          </Link>
        )}
        <button
          type="button"
          onClick={handleSignOut}
          className="block w-full rounded-md px-2 py-1.5 text-right text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          خروج از حساب
        </button>
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen bg-background lg:grid lg:grid-cols-[16rem_1fr]">
      <aside className="hidden border-l border-border bg-card lg:block lg:h-screen lg:sticky lg:top-0">
        {sidebar}
      </aside>

      <div className="flex min-h-screen flex-col">
        <header className="flex items-center justify-between gap-3 border-b border-border bg-card px-4 py-3 lg:hidden">
          <Logo className="h-6 w-auto" />
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="rounded-md border border-border px-3 py-1.5 text-xs"
          >
            {open ? "بستن منو" : "منو"}
          </button>
        </header>
        {open && <div className="border-b border-border bg-card lg:hidden">{sidebar}</div>}
        <main className={cn("flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8")}>{children}</main>
      </div>
    </div>
  );
}

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string | undefined;
  actions?: ReactNode | undefined;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-foreground">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions}
    </div>
  );
}
