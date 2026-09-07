import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import type { Tone } from "@/lib/workspace/labels";

const toneClasses: Record<Tone, string> = {
  neutral: "bg-muted text-muted-foreground border-border",
  info: "bg-chart-2/10 text-chart-2 border-chart-2/25",
  progress: "bg-chart-3/10 text-chart-3 border-chart-3/25",
  warning: "bg-chart-4/10 text-chart-4 border-chart-4/25",
  success: "bg-chart-5/10 text-chart-5 border-chart-5/25",
  danger: "bg-destructive/10 text-destructive border-destructive/25",
};

export function StatusBadge({ tone = "neutral", children }: { tone?: Tone | undefined; children: ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        toneClasses[tone],
      )}
    >
      {children}
    </span>
  );
}

export function Panel({
  title,
  description,
  action,
  children,
  className,
}: {
  title?: ReactNode | undefined;
  description?: ReactNode | undefined;
  action?: ReactNode | undefined;
  children?: ReactNode;
  className?: string | undefined;
}) {
  return (
    <section className={cn("rounded-xl border border-border bg-card", className)}>
      {(title || action) && (
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
          <div>
            {title && <h2 className="text-sm font-semibold text-foreground">{title}</h2>}
            {description && (
              <p className="mt-1 text-xs text-muted-foreground">{description}</p>
            )}
          </div>
          {action}
        </header>
      )}
      <div className="p-5">{children}</div>
    </section>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string | undefined;
  action?: ReactNode | undefined;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border px-6 py-12 text-center">
      <p className="text-sm font-medium text-foreground">{title}</p>
      {description && (
        <p className="mt-2 max-w-md text-xs leading-6 text-muted-foreground">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function LoadingState({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-3" aria-busy="true" aria-live="polite">
      {Array.from({ length: rows }).map((_, index) => (
        <Skeleton key={index} className="h-12 w-full rounded-lg" />
      ))}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message?: string | undefined; onRetry?: () => void }) {
  return (
    <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-5 py-6 text-center">
      <p className="text-sm font-medium text-destructive">اطلاعات بارگذاری نشد</p>
      <p className="mt-2 text-xs text-muted-foreground">
        {message ?? "ارتباط با سرویس داخلی برقرار نشد. دوباره تلاش کنید."}
      </p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 rounded-md border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted"
        >
          تلاش دوباره
        </button>
      )}
    </div>
  );
}

export function Metric({
  label,
  value,
  hint,
  tone = "neutral",
}: {
  label: string;
  value: ReactNode;
  hint?: string | undefined;
  tone?: Tone | undefined;
}) {
  return (
    <div className="rounded-xl border border-border bg-card px-4 py-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p
        className={cn(
          "mt-2 text-2xl font-semibold tabular-nums",
          tone === "danger" ? "text-destructive" : "text-foreground",
        )}
      >
        {value}
      </p>
      {hint && <p className="mt-1 text-[11px] text-muted-foreground">{hint}</p>}
    </div>
  );
}

export type Column<T> = {
  key: string;
  header: string;
  cell: (row: T) => ReactNode;
  className?: string | undefined;
};

export function DataTable<T extends { id: string | number }>({
  rows,
  columns,
  loading,
  error,
  empty,
}: {
  rows: T[] | undefined;
  columns: Column<T>[];
  loading?: boolean | undefined;
  error?: unknown;
  empty: { title: string; description?: string };
}) {
  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error instanceof Error ? error.message : undefined} />;
  if (!rows || rows.length === 0)
    return <EmptyState title={empty.title} description={empty.description} />;

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] text-right text-sm">
        <thead>
          <tr className="border-b border-border text-xs text-muted-foreground">
            {columns.map((column) => (
              <th key={column.key} className={cn("px-3 py-2 font-medium", column.className)}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-border/60 last:border-0">
              {columns.map((column) => (
                <td key={column.key} className={cn("px-3 py-3 align-middle", column.className)}>
                  {column.cell(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
