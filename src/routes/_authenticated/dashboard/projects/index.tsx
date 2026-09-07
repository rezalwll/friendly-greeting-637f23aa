import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { useAuth } from "@/hooks/use-auth";
import { PageHeader } from "@/components/workspace/shell";
import { EmptyState, ErrorState, LoadingState, StatusBadge } from "@/components/workspace/states";
import { myProjectsQuery } from "@/lib/workspace/queries";
import { formatDate, label, projectStatusLabels } from "@/lib/workspace/labels";

export const Route = createFileRoute("/_authenticated/dashboard/projects/")({
  component: ProjectsPage,
});

const filters = [
  { key: "all", fa: "همه" },
  ...Object.entries(projectStatusLabels).map(([key, value]) => ({ key, fa: value.fa })),
];

function ProjectsPage() {
  const { userId } = useAuth();
  const [filter, setFilter] = useState("all");
  const projects = useQuery({ ...myProjectsQuery(userId ?? ""), enabled: !!userId });

  const rows = (projects.data ?? []).filter(
    (project) => filter === "all" || project.status === filter,
  );

  return (
    <>
      <PageHeader title="پروژه‌ها" description="وضعیت هر پروژه و اقدام بعدی آن." />

      <div className="mb-5 flex flex-wrap gap-2">
        {filters.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setFilter(item.key)}
            className={`rounded-full border px-3 py-1 text-xs ${
              filter === item.key
                ? "border-foreground bg-foreground text-background"
                : "border-border text-muted-foreground hover:bg-muted"
            }`}
          >
            {item.fa}
          </button>
        ))}
      </div>

      {projects.isLoading ? (
        <LoadingState />
      ) : projects.error ? (
        <ErrorState message={(projects.error as Error).message} onRetry={() => projects.refetch()} />
      ) : rows.length === 0 ? (
        <EmptyState
          title="پروژه‌ای در این وضعیت نیست"
          description="پروژه‌های شما پس از ثبت توسط تیم رای‌کد اینجا نمایش داده می‌شوند."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {rows.map((project) => {
            const status = label(projectStatusLabels, project.status);
            return (
              <Link
                key={project.id}
                to="/dashboard/projects/$id"
                params={{ id: project.id }}
                className="rounded-xl border border-border bg-card p-5 transition-colors hover:border-brand/50"
              >
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-sm font-semibold">{project.name}</h2>
                  <StatusBadge tone={status.tone}>{status.fa}</StatusBadge>
                </div>
                <div className="mt-4">
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-brand"
                      style={{ width: `${Math.min(100, project.progress)}%` }}
                    />
                  </div>
                  <p className="mt-1 text-[11px] text-muted-foreground">{project.progress}٪ پیشرفت</p>
                </div>
                <dl className="mt-4 space-y-1 text-xs text-muted-foreground">
                  <div className="flex justify-between gap-2">
                    <dt>تحویل مورد انتظار</dt>
                    <dd>{formatDate(project.expected_delivery)}</dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt>آخرین فعالیت</dt>
                    <dd>{formatDate(project.updated_at)}</dd>
                  </div>
                </dl>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
