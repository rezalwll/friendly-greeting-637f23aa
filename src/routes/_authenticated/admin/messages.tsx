import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/workspace/shell";
import { DataTable, Panel, StatusBadge } from "@/components/workspace/states";
import { formatDateTime, label, messageStatusLabels } from "@/lib/workspace/labels";

export const Route = createFileRoute("/_authenticated/admin/messages")({
  component: MessagesPage,
});

function MessagesPage() {
  const queryClient = useQueryClient();

  const messages = useQuery({
    queryKey: ["admin-messages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw new Error(error.message);
      return data;
    },
  });

  const update = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from("contact_messages")
        .update({ status: status as never })
        .eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-messages"] }),
  });

  return (
    <>
      <PageHeader
        title="پیام‌ها"
        description="پیام‌های فرم تماس. پاسخ‌دهی خارج از سامانه انجام می‌شود؛ هیچ سرویس ایمیل یا پیامکی متصل نیست."
      />
      <Panel>
        <DataTable
          rows={messages.data ?? []}
          loading={messages.isLoading}
          error={messages.error}
          empty={{ title: "پیامی دریافت نشده" }}
          columns={[
            { key: "name", header: "فرستنده", cell: (row) => row.name },
            { key: "subject", header: "موضوع", cell: (row) => row.subject ?? "—" },
            {
              key: "body",
              header: "متن",
              cell: (row) => <span className="line-clamp-2 max-w-md">{row.body}</span>,
            },
            { key: "date", header: "زمان", cell: (row) => formatDateTime(row.created_at) },
            {
              key: "status",
              header: "وضعیت",
              cell: (row) => {
                const value = label(messageStatusLabels, row.status);
                return <StatusBadge tone={value.tone}>{value.fa}</StatusBadge>;
              },
            },
            {
              key: "actions",
              header: "",
              cell: (row) => (
                <select
                  value={row.status}
                  onChange={(event) => update.mutate({ id: row.id, status: event.target.value })}
                  className="rounded-md border border-input bg-background px-2 py-1 text-xs"
                >
                  {Object.entries(messageStatusLabels).map(([value, item]) => (
                    <option key={value} value={value}>
                      {item.fa}
                    </option>
                  ))}
                </select>
              ),
            },
          ]}
        />
      </Panel>
    </>
  );
}
