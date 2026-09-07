import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/workspace/shell";
import { DataTable, Panel } from "@/components/workspace/states";
import { formatDateTime } from "@/lib/workspace/labels";

export const Route = createFileRoute("/_authenticated/admin/logs")({
  component: LogsPage,
});

function LogsPage() {
  const logs = useQuery({
    queryKey: ["admin-logs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("activity_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(300);
      if (error) throw new Error(error.message);
      return data;
    },
  });

  return (
    <>
      <PageHeader title="گزارش فعالیت" description="ثبت تغییرات مهم انجام‌شده توسط تیم." />
      <Panel>
        <DataTable
          rows={logs.data ?? []}
          loading={logs.isLoading}
          error={logs.error}
          empty={{ title: "فعالیتی ثبت نشده" }}
          columns={[
            { key: "action", header: "اقدام", cell: (row) => row.action },
            { key: "entity", header: "موضوع", cell: (row) => row.entity_type ?? "—" },
            {
              key: "details",
              header: "جزئیات",
              cell: (row) => (
                <span className="line-clamp-1 max-w-sm text-xs" dir="ltr">
                  {JSON.stringify(row.details)}
                </span>
              ),
            },
            { key: "time", header: "زمان", cell: (row) => formatDateTime(row.created_at) },
          ]}
        />
      </Panel>
    </>
  );
}
