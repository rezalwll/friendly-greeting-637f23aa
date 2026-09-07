import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { useAuth } from "@/hooks/use-auth";
import { PageHeader } from "@/components/workspace/shell";
import {
  DataTable,
  EmptyState,
  ErrorState,
  LoadingState,
  Panel,
  StatusBadge,
} from "@/components/workspace/states";
import {
  milestonesQuery,
  myFilesQuery,
  myInvoicesQuery,
  myTicketsQuery,
  projectActivityQuery,
  projectQuery,
} from "@/lib/workspace/queries";
import {
  fileCategoryLabels,
  formatAmount,
  formatDate,
  formatDateTime,
  installmentStatusLabels,
  label,
  milestoneStatusLabels,
  projectStatusLabels,
  ticketStatusLabels,
} from "@/lib/workspace/labels";

export const Route = createFileRoute("/_authenticated/dashboard/projects/$id")({
  component: ProjectWorkspace,
});

const tabs = [
  { key: "overview", fa: "نمای کلی" },
  { key: "milestones", fa: "مراحل" },
  { key: "activity", fa: "فعالیت‌ها" },
  { key: "files", fa: "فایل‌ها" },
  { key: "payments", fa: "پرداخت‌ها" },
  { key: "support", fa: "پشتیبانی" },
] as const;

function ProjectWorkspace() {
  const { id } = Route.useParams();
  const { userId } = useAuth();
  const [tab, setTab] = useState<(typeof tabs)[number]["key"]>("overview");

  const project = useQuery(projectQuery(id));
  const milestones = useQuery(milestonesQuery(id));
  const activity = useQuery(projectActivityQuery(id));
  const files = useQuery({ ...myFilesQuery(userId ?? "", id), enabled: !!userId });
  const invoices = useQuery({ ...myInvoicesQuery(userId ?? ""), enabled: !!userId });
  const tickets = useQuery({ ...myTicketsQuery(userId ?? ""), enabled: !!userId });

  if (project.isLoading) return <LoadingState rows={5} />;
  if (project.error)
    return <ErrorState message={(project.error as Error).message} onRetry={() => project.refetch()} />;
  if (!project.data)
    return (
      <EmptyState
        title="این پروژه پیدا نشد"
        description="ممکن است حذف شده باشد یا به حساب شما مرتبط نباشد."
        action={
          <Link to="/dashboard/projects" className="text-xs text-brand">
            بازگشت به پروژه‌ها
          </Link>
        }
      />
    );

  const data = project.data;
  const status = label(projectStatusLabels, data.status);
  const ordered = milestones.data ?? [];
  const current = ordered.find((item) => item.status === "in_progress" || item.status === "waiting_approval");
  const next = ordered.find((item) => item.status === "pending");
  const projectInvoices = (invoices.data ?? []).filter((invoice) => invoice.project_id === id);
  const projectInstallments = projectInvoices.flatMap((invoice) => invoice.installments ?? []);
  const projectTickets = (tickets.data ?? []).filter((ticket) => ticket.project_id === id);

  return (
    <>
      <PageHeader
        title={data.name}
        description={data.scope ?? undefined}
        actions={<StatusBadge tone={status.tone}>{status.fa}</StatusBadge>}
      />

      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <Field title="پیشرفت" value={`${data.progress}٪`} />
        <Field title="تاریخ شروع" value={formatDate(data.start_date)} />
        <Field title="تحویل مورد انتظار" value={formatDate(data.expected_delivery)} />
      </div>

      <div className="mb-6 flex flex-wrap gap-2 border-b border-border pb-2">
        {tabs.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setTab(item.key)}
            className={`rounded-md px-3 py-1.5 text-sm ${
              tab === item.key ? "bg-muted font-medium text-foreground" : "text-muted-foreground"
            }`}
          >
            {item.fa}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Panel title="اکنون چه اتفاقی می‌افتد؟">
            <p className="text-sm leading-7 text-muted-foreground">
              {data.latest_update ?? "هنوز بروزرسانی‌ای از سمت تیم ثبت نشده است."}
            </p>
          </Panel>
          <Panel title="اقدام موردنیاز از سمت شما" className="border-brand/40">
            <p className="text-sm leading-7 text-muted-foreground">
              {data.client_action_required ?? "در حال حاضر اقدامی از سمت شما لازم نیست."}
            </p>
          </Panel>
          <Panel title="مرحله جاری">
            {current ? (
              <MilestoneCard milestone={current} />
            ) : (
              <EmptyState title="مرحله جاری ثبت نشده" />
            )}
          </Panel>
          <Panel title="مرحله بعدی">
            {next ? <MilestoneCard milestone={next} /> : <EmptyState title="مرحله بعدی ثبت نشده" />}
          </Panel>
        </div>
      )}

      {tab === "milestones" && (
        <Panel title="مراحل پروژه">
          {milestones.isLoading ? (
            <LoadingState />
          ) : ordered.length === 0 ? (
            <EmptyState title="مرحله‌ای تعریف نشده" />
          ) : (
            <ol className="space-y-3">
              {ordered.map((milestone) => (
                <li key={milestone.id} className="rounded-lg border border-border p-4">
                  <MilestoneCard milestone={milestone} />
                </li>
              ))}
            </ol>
          )}
        </Panel>
      )}

      {tab === "activity" && (
        <Panel title="تاریخچه فعالیت">
          {activity.isLoading ? (
            <LoadingState />
          ) : (activity.data ?? []).length === 0 ? (
            <EmptyState title="فعالیتی ثبت نشده" />
          ) : (
            <ol className="space-y-3 border-r border-border pr-4">
              {(activity.data ?? []).map((item) => (
                <li key={item.id} className="text-sm">
                  <p className="font-medium">{item.description ?? item.event_type}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.actor_label ? `${item.actor_label} — ` : ""}
                    {formatDateTime(item.created_at)}
                  </p>
                </li>
              ))}
            </ol>
          )}
        </Panel>
      )}

      {tab === "files" && (
        <Panel title="فایل‌های پروژه">
          <DataTable
            rows={files.data ?? []}
            loading={files.isLoading}
            error={files.error}
            empty={{ title: "فایلی برای این پروژه به اشتراک گذاشته نشده" }}
            columns={[
              { key: "name", header: "نام", cell: (row) => row.name },
              {
                key: "category",
                header: "دسته",
                cell: (row) => label(fileCategoryLabels, row.category).fa,
              },
              { key: "date", header: "تاریخ", cell: (row) => formatDate(row.created_at) },
            ]}
          />
        </Panel>
      )}

      {tab === "payments" && (
        <Panel title="پرداخت‌های پروژه">
          <DataTable
            rows={projectInstallments}
            loading={invoices.isLoading}
            error={invoices.error}
            empty={{ title: "قسطی برای این پروژه ثبت نشده" }}
            columns={[
              { key: "label", header: "قسط", cell: (row) => row.label },
              { key: "amount", header: "مبلغ", cell: (row) => formatAmount(row.amount) },
              { key: "due", header: "سررسید", cell: (row) => formatDate(row.due_date) },
              {
                key: "status",
                header: "وضعیت",
                cell: (row) => {
                  const value = label(installmentStatusLabels, row.status);
                  return <StatusBadge tone={value.tone}>{value.fa}</StatusBadge>;
                },
              },
            ]}
          />
        </Panel>
      )}

      {tab === "support" && (
        <Panel
          title="تیکت‌های مرتبط"
          action={
            <Link to="/dashboard/support" className="text-xs text-brand">
              ثبت تیکت جدید
            </Link>
          }
        >
          <DataTable
            rows={projectTickets}
            loading={tickets.isLoading}
            error={tickets.error}
            empty={{ title: "تیکتی برای این پروژه ثبت نشده" }}
            columns={[
              { key: "subject", header: "موضوع", cell: (row) => row.subject },
              {
                key: "status",
                header: "وضعیت",
                cell: (row) => {
                  const value = label(ticketStatusLabels, row.status);
                  return <StatusBadge tone={value.tone}>{value.fa}</StatusBadge>;
                },
              },
              { key: "updated", header: "بروزرسانی", cell: (row) => formatDate(row.updated_at) },
            ]}
          />
        </Panel>
      )}
    </>
  );
}

function Field({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card px-4 py-3">
      <p className="text-xs text-muted-foreground">{title}</p>
      <p className="mt-1 text-sm font-medium">{value}</p>
    </div>
  );
}

function MilestoneCard({
  milestone,
}: {
  milestone: {
    title: string;
    description: string | null;
    status: string;
    start_date: string | null;
    expected_completion: string | null;
    deliverables: string | null;
    client_approval_required: boolean;
  };
}) {
  const status = label(milestoneStatusLabels, milestone.status);
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-semibold">{milestone.title}</p>
        <StatusBadge tone={status.tone}>{status.fa}</StatusBadge>
      </div>
      {milestone.description && (
        <p className="mt-2 text-xs leading-6 text-muted-foreground">{milestone.description}</p>
      )}
      <dl className="mt-3 grid gap-1 text-xs text-muted-foreground sm:grid-cols-2">
        <div className="flex gap-2">
          <dt>شروع:</dt>
          <dd>{formatDate(milestone.start_date)}</dd>
        </div>
        <div className="flex gap-2">
          <dt>پایان مورد انتظار:</dt>
          <dd>{formatDate(milestone.expected_completion)}</dd>
        </div>
      </dl>
      {milestone.deliverables && (
        <p className="mt-2 text-xs text-muted-foreground">تحویل‌شدنی‌ها: {milestone.deliverables}</p>
      )}
      {milestone.client_approval_required && (
        <p className="mt-2 text-xs text-brand">این مرحله نیاز به تأیید شما دارد.</p>
      )}
    </div>
  );
}
