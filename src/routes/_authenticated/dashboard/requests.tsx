import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { useAuth } from "@/hooks/use-auth";
import { PageHeader } from "@/components/workspace/shell";
import { DataTable, Panel, StatusBadge } from "@/components/workspace/states";
import { myRequestsQuery } from "@/lib/workspace/queries";
import { formatDate, label, leadStatusLabels, leadTypeLabels } from "@/lib/workspace/labels";

export const Route = createFileRoute("/_authenticated/dashboard/requests")({
  component: RequestsPage,
});

function RequestsPage() {
  const { userId } = useAuth();
  const requests = useQuery({ ...myRequestsQuery(userId ?? ""), enabled: !!userId });

  return (
    <>
      <PageHeader
        title="درخواست‌ها"
        description="درخواست‌های ثبت‌شده شما و وضعیت بررسی آن‌ها. هر درخواست می‌تواند به پروژه تبدیل شود."
      />
      <Panel>
        <DataTable
          rows={requests.data ?? []}
          loading={requests.isLoading}
          error={requests.error}
          empty={{
            title: "درخواستی ثبت نشده",
            description: "از صفحه «شروع پروژه» یا «بررسی فنی» می‌توانید درخواست جدید ثبت کنید.",
          }}
          columns={[
            {
              key: "type",
              header: "نوع",
              cell: (row) => label(leadTypeLabels, row.lead_type).fa,
            },
            { key: "service", header: "خدمت", cell: (row) => row.service ?? "—" },
            {
              key: "status",
              header: "وضعیت",
              cell: (row) => {
                const value = label(leadStatusLabels, row.status);
                return <StatusBadge tone={value.tone}>{value.fa}</StatusBadge>;
              },
            },
            { key: "created", header: "تاریخ ثبت", cell: (row) => formatDate(row.created_at) },
          ]}
        />
      </Panel>
    </>
  );
}
