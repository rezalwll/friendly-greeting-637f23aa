import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/workspace/shell";
import { EmptyState, LoadingState, Metric, Panel } from "@/components/workspace/states";
import { formatDate } from "@/lib/workspace/labels";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: AdminOverview,
});

async function count(table: string, apply?: (query: any) => any) {
  let query = supabase.from(table as never).select("*", { count: "exact", head: true });
  if (apply) query = apply(query);
  const { count: value, error } = await query;
  if (error) throw new Error(error.message);
  return value ?? 0;
}

function AdminOverview() {
  const overview = useQuery({
    queryKey: ["admin-overview"],
    queryFn: async () => ({
      users: await count("profiles"),
      newLeads: await count("leads", (q) => q.eq("status", "new")),
      activeProjects: await count("projects", (q) =>
        q.not("status", "in", "(completed,paused)"),
      ),
      waitingProjects: await count("projects", (q) => q.eq("status", "waiting_client")),
      openTickets: await count("tickets", (q) => q.in("status", ["open", "in_progress"])),
      urgentTickets: await count("tickets", (q) =>
        q.eq("priority", "urgent").in("status", ["open", "in_progress"]),
      ),
      newMessages: await count("contact_messages", (q) => q.eq("status", "new")),
      publishedArticles: await count("articles", (q) => q.eq("status", "published")),
      draftContent: await count("content_items", (q) => q.in("status", ["draft", "review"])),
      overdueInstallments: await count("installments", (q) => q.eq("status", "overdue")),
    }),
  });

  const recentLeads = useQuery({
    queryKey: ["admin-recent-leads"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("leads")
        .select("id,name,lead_type,status,created_at")
        .eq("status", "new")
        .order("created_at", { ascending: false })
        .limit(6);
      if (error) throw new Error(error.message);
      return data;
    },
  });

  const data = overview.data;

  const attention = data
    ? [
        { label: "سرنخ‌های بی‌پاسخ", value: data.newLeads, to: "/admin/leads" as const },
        { label: "تیکت‌های فوری", value: data.urgentTickets, to: "/admin/tickets" as const },
        {
          label: "پروژه‌های منتظر مشتری",
          value: data.waitingProjects,
          to: "/admin/projects" as const,
        },
        {
          label: "اقساط معوق",
          value: data.overdueInstallments,
          to: "/admin/installments" as const,
        },
        { label: "پیام‌های خوانده‌نشده", value: data.newMessages, to: "/admin/messages" as const },
        {
          label: "محتوای پیش‌نویس/بازبینی",
          value: data.draftContent,
          to: "/admin/content/service" as const,
        },
      ].filter((item) => item.value > 0)
    : [];

  return (
    <>
      <PageHeader
        title="داشبورد مدیریت"
        description="فقط داده واقعی داخلی؛ هیچ سرویس تحلیلی بیرونی متصل نیست."
      />

      <Panel
        title="نیازمند اقدام"
        description="کارهایی که اگر انجام نشوند، جریان کسب‌وکار متوقف می‌شود."
        className="mb-6 border-brand/40"
      >
        {overview.isLoading ? (
          <LoadingState rows={2} />
        ) : attention.length === 0 ? (
          <EmptyState title="موردی نیازمند اقدام نیست" />
        ) : (
          <ul className="grid gap-2 sm:grid-cols-2">
            {attention.map((item) => (
              <li key={item.label}>
                <Link
                  to={item.to}
                  className="flex items-center justify-between rounded-lg border border-border px-4 py-3 text-sm hover:bg-muted"
                >
                  <span>{item.label}</span>
                  <span className="font-semibold tabular-nums text-brand">{item.value}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <Metric label="کاربران ثبت‌شده" value={data?.users ?? "—"} />
        <Metric label="درخواست‌های جدید" value={data?.newLeads ?? "—"} />
        <Metric label="پروژه‌های فعال" value={data?.activeProjects ?? "—"} />
        <Metric label="تیکت‌های باز" value={data?.openTickets ?? "—"} />
        <Metric label="پیام‌ها" value={data?.newMessages ?? "—"} />
        <Metric label="مقاله‌های منتشرشده" value={data?.publishedArticles ?? "—"} />
      </div>

      <Panel title="آخرین سرنخ‌های بی‌پاسخ">
        {recentLeads.isLoading ? (
          <LoadingState rows={3} />
        ) : (recentLeads.data ?? []).length === 0 ? (
          <EmptyState title="سرنخ بی‌پاسخی نیست" />
        ) : (
          <ul className="space-y-2 text-sm">
            {(recentLeads.data ?? []).map((lead) => (
              <li
                key={lead.id}
                className="flex items-center justify-between rounded-lg border border-border px-4 py-2"
              >
                <span>{lead.name}</span>
                <span className="text-xs text-muted-foreground">{formatDate(lead.created_at)}</span>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </>
  );
}
