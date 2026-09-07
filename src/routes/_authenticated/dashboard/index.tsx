import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { useAuth } from "@/hooks/use-auth";
import { PageHeader } from "@/components/workspace/shell";
import {
  DataTable,
  EmptyState,
  LoadingState,
  Metric,
  Panel,
  StatusBadge,
} from "@/components/workspace/states";
import {
  myInvoicesQuery,
  myNotificationsQuery,
  myProfileQuery,
  myProjectsQuery,
  myTicketsQuery,
  myFilesQuery,
} from "@/lib/workspace/queries";
import {
  formatAmount,
  formatDate,
  formatDateTime,
  installmentStatusLabels,
  label,
  projectStatusLabels,
  ticketStatusLabels,
} from "@/lib/workspace/labels";

export const Route = createFileRoute("/_authenticated/dashboard/")({
  component: OverviewPage,
});

function OverviewPage() {
  const { userId } = useAuth();
  const id = userId ?? "";

  const profile = useQuery({ ...myProfileQuery(id), enabled: !!id });
  const projects = useQuery({ ...myProjectsQuery(id), enabled: !!id });
  const invoices = useQuery({ ...myInvoicesQuery(id), enabled: !!id });
  const tickets = useQuery({ ...myTicketsQuery(id), enabled: !!id });
  const files = useQuery({ ...myFilesQuery(id), enabled: !!id });
  const notifications = useQuery({ ...myNotificationsQuery(id), enabled: !!id });

  const activeProjects = (projects.data ?? []).filter(
    (project) => project.status !== "completed" && project.status !== "paused",
  );
  const waitingProjects = (projects.data ?? []).filter(
    (project) => project.status === "waiting_client" || project.client_action_required,
  );
  const installments = (invoices.data ?? []).flatMap((invoice) =>
    (invoice.installments ?? []).map((item) => ({ ...item, invoice })),
  );
  const dueInstallments = installments.filter(
    (item) => item.status === "due" || item.status === "overdue",
  );
  const upcoming = installments
    .filter((item) => item.status === "upcoming" || item.status === "due")
    .sort((a, b) => (a.due_date ?? "").localeCompare(b.due_date ?? ""))
    .slice(0, 5);
  const openTickets = (tickets.data ?? []).filter(
    (ticket) => ticket.status !== "closed" && ticket.status !== "resolved",
  );
  const waitingTickets = openTickets.filter((ticket) => ticket.status === "waiting_customer");
  const unread = (notifications.data ?? []).filter((item) => !item.read_at);

  const loading = projects.isLoading || invoices.isLoading || tickets.isLoading;

  const attention = [
    ...waitingProjects.map((project) => ({
      id: `project-${project.id}`,
      text: project.client_action_required || `پروژه «${project.name}» منتظر پاسخ شماست.`,
      to: "/dashboard/projects" as const,
    })),
    ...dueInstallments.map((item) => ({
      id: `installment-${item.id}`,
      text: `قسط «${item.label}» — ${formatAmount(item.amount)} (${
        label(installmentStatusLabels, item.status).fa
      })`,
      to: "/dashboard/payments" as const,
    })),
    ...waitingTickets.map((ticket) => ({
      id: `ticket-${ticket.id}`,
      text: `تیکت «${ticket.subject}» منتظر پاسخ شماست.`,
      to: "/dashboard/support" as const,
    })),
  ];

  return (
    <>
      <PageHeader
        title={`سلام${profile.data?.full_name ? `، ${profile.data.full_name}` : ""}`}
        description="خلاصه وضعیت پروژه‌ها، پرداخت‌ها و پشتیبانی شما."
      />

      <Panel
        title="نیازمند توجه شما"
        description="مواردی که تا زمانی که شما اقدام نکنید، کار متوقف می‌ماند."
        className="mb-6 border-brand/40"
      >
        {loading ? (
          <LoadingState rows={2} />
        ) : attention.length === 0 ? (
          <EmptyState
            title="کاری در انتظار شما نیست"
            description="هر زمان تأیید، پاسخ یا پرداختی لازم باشد، همین‌جا نمایش داده می‌شود."
          />
        ) : (
          <ul className="space-y-2">
            {attention.map((item) => (
              <li key={item.id}>
                <Link
                  to={item.to}
                  className="flex items-center justify-between gap-3 rounded-lg border border-border px-4 py-3 text-sm hover:bg-muted"
                >
                  <span>{item.text}</span>
                  <span className="text-xs text-brand">مشاهده</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Metric label="پروژه‌های فعال" value={activeProjects.length} />
        <Metric
          label="پرداخت‌های سررسیدشده"
          value={dueInstallments.length}
          tone={dueInstallments.length ? "danger" : "neutral"}
        />
        <Metric label="تیکت‌های باز" value={openTickets.length} />
        <Metric label="اعلان‌های خوانده‌نشده" value={unread.length} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="پروژه‌های فعال">
          <DataTable
            rows={activeProjects}
            loading={projects.isLoading}
            error={projects.error}
            empty={{
              title: "پروژه فعالی ثبت نشده",
              description: "پس از شروع همکاری، پروژه‌های شما اینجا نمایش داده می‌شود.",
            }}
            columns={[
              {
                key: "name",
                header: "پروژه",
                cell: (row) => (
                  <Link
                    to="/dashboard/projects/$id"
                    params={{ id: row.id }}
                    className="font-medium hover:text-brand"
                  >
                    {row.name}
                  </Link>
                ),
              },
              {
                key: "status",
                header: "وضعیت",
                cell: (row) => {
                  const value = label(projectStatusLabels, row.status);
                  return <StatusBadge tone={value.tone}>{value.fa}</StatusBadge>;
                },
              },
              { key: "progress", header: "پیشرفت", cell: (row) => `${row.progress}٪` },
              {
                key: "updated",
                header: "آخرین فعالیت",
                cell: (row) => formatDate(row.updated_at),
              },
            ]}
          />
        </Panel>

        <Panel title="پرداخت‌های پیش‌رو">
          <DataTable
            rows={upcoming}
            loading={invoices.isLoading}
            error={invoices.error}
            empty={{ title: "پرداخت پیش‌رویی ثبت نشده" }}
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

        <Panel title="تیکت‌های باز">
          <DataTable
            rows={openTickets}
            loading={tickets.isLoading}
            error={tickets.error}
            empty={{ title: "تیکت بازی ندارید" }}
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

        <Panel title="فایل‌های تازه">
          <DataTable
            rows={(files.data ?? []).slice(0, 6)}
            loading={files.isLoading}
            error={files.error}
            empty={{ title: "فایلی به اشتراک گذاشته نشده" }}
            columns={[
              { key: "name", header: "نام", cell: (row) => row.name },
              { key: "created", header: "تاریخ", cell: (row) => formatDate(row.created_at) },
            ]}
          />
        </Panel>

        <Panel title="اعلان‌ها" className="lg:col-span-2">
          {notifications.isLoading ? (
            <LoadingState rows={2} />
          ) : (notifications.data ?? []).length === 0 ? (
            <EmptyState title="اعلانی وجود ندارد" />
          ) : (
            <ul className="space-y-2 text-sm">
              {(notifications.data ?? []).slice(0, 6).map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between gap-3 rounded-lg border border-border px-4 py-2"
                >
                  <span>{item.title}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatDateTime(item.created_at)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </>
  );
}
