import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/workspace/shell";
import { DataTable, EmptyState, LoadingState, Panel, StatusBadge } from "@/components/workspace/states";
import {
  formatDateTime,
  label,
  ticketCategoryLabels,
  ticketPriorityLabels,
  ticketStatusLabels,
} from "@/lib/workspace/labels";

export const Route = createFileRoute("/_authenticated/admin/tickets")({
  component: AdminTicketsPage,
});

function AdminTicketsPage() {
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState<string | null>(null);
  const [reply, setReply] = useState("");

  const tickets = useQuery({
    queryKey: ["admin-tickets"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tickets")
        .select("*")
        .order("updated_at", { ascending: false });
      if (error) throw new Error(error.message);
      return data;
    },
  });

  const messages = useQuery({
    queryKey: ["admin-ticket-messages", selected],
    enabled: Boolean(selected),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ticket_messages")
        .select("*")
        .eq("ticket_id", selected!)
        .order("created_at", { ascending: true });
      if (error) throw new Error(error.message);
      return data;
    },
  });

  const send = useMutation({
    mutationFn: async () => {
      const { data: auth } = await supabase.auth.getUser();
      const { error } = await supabase.from("ticket_messages").insert({
        ticket_id: selected!,
        body: reply,
        author_id: auth.user?.id ?? null,
        author_is_staff: true,
      });
      if (error) throw new Error(error.message);
      await supabase
        .from("tickets")
        .update({ status: "waiting_customer", last_reply_at: new Date().toISOString() })
        .eq("id", selected!);
    },
    onSuccess: () => {
      setReply("");
      void queryClient.invalidateQueries({ queryKey: ["admin-ticket-messages", selected] });
      void queryClient.invalidateQueries({ queryKey: ["admin-tickets"] });
    },
  });

  const update = useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Record<string, unknown> }) => {
      const { error } = await supabase.from("tickets").update(patch as never).eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-tickets"] }),
  });

  const current = (tickets.data ?? []).find((ticket) => ticket.id === selected) ?? null;

  return (
    <>
      <PageHeader title="تیکت‌ها" description="پاسخ‌گویی و مدیریت وضعیت درخواست‌های پشتیبانی." />

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <Panel title="فهرست تیکت‌ها">
          <DataTable
            rows={tickets.data ?? []}
            loading={tickets.isLoading}
            error={tickets.error}
            empty={{ title: "تیکتی ثبت نشده" }}
            columns={[
              {
                key: "subject",
                header: "موضوع",
                cell: (row) => (
                  <button type="button" onClick={() => setSelected(row.id)} className="hover:text-brand">
                    {row.subject}
                  </button>
                ),
              },
              {
                key: "category",
                header: "دسته",
                cell: (row) => label(ticketCategoryLabels, row.category).fa,
              },
              {
                key: "priority",
                header: "اولویت",
                cell: (row) => {
                  const value = label(ticketPriorityLabels, row.priority);
                  return <StatusBadge tone={value.tone}>{value.fa}</StatusBadge>;
                },
              },
              {
                key: "status",
                header: "وضعیت",
                cell: (row) => {
                  const value = label(ticketStatusLabels, row.status);
                  return <StatusBadge tone={value.tone}>{value.fa}</StatusBadge>;
                },
              },
            ]}
          />
        </Panel>

        <Panel title="گفت‌وگو">
          {!current ? (
            <EmptyState title="تیکتی انتخاب نشده" description="از فهرست کنار، یک تیکت را باز کنید." />
          ) : (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <select
                  value={current.status}
                  onChange={(event) =>
                    update.mutate({ id: current.id, patch: { status: event.target.value } })
                  }
                  className="rounded-md border border-input bg-background px-2 py-1 text-xs"
                >
                  {Object.entries(ticketStatusLabels).map(([value, item]) => (
                    <option key={value} value={value}>
                      {item.fa}
                    </option>
                  ))}
                </select>
                <select
                  value={current.priority}
                  onChange={(event) =>
                    update.mutate({ id: current.id, patch: { priority: event.target.value } })
                  }
                  className="rounded-md border border-input bg-background px-2 py-1 text-xs"
                >
                  {Object.entries(ticketPriorityLabels).map(([value, item]) => (
                    <option key={value} value={value}>
                      {item.fa}
                    </option>
                  ))}
                </select>
              </div>

              {messages.isLoading ? (
                <LoadingState rows={2} />
              ) : (
                <ul className="space-y-3">
                  {(messages.data ?? []).map((message) => (
                    <li
                      key={message.id}
                      className={`rounded-lg border px-4 py-3 text-sm ${
                        message.author_is_staff
                          ? "border-brand/30 bg-brand/5"
                          : "border-border bg-muted/40"
                      }`}
                    >
                      <p className="whitespace-pre-wrap leading-7">{message.body}</p>
                      <p className="mt-2 text-[11px] text-muted-foreground">
                        {message.author_is_staff ? "رای‌کد" : "مشتری"} —{" "}
                        {formatDateTime(message.created_at)}
                      </p>
                    </li>
                  ))}
                </ul>
              )}

              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  send.mutate();
                }}
                className="space-y-2"
              >
                <textarea
                  required
                  rows={4}
                  value={reply}
                  onChange={(event) => setReply(event.target.value)}
                  placeholder="پاسخ شما…"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
                <button
                  type="submit"
                  disabled={send.isPending}
                  className="rounded-md bg-foreground px-4 py-2 text-sm text-background disabled:opacity-60"
                >
                  ارسال پاسخ
                </button>
              </form>
            </div>
          )}
        </Panel>
      </div>
    </>
  );
}
