import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { PageHeader } from "@/components/workspace/shell";
import {
  DataTable,
  EmptyState,
  LoadingState,
  Panel,
  StatusBadge,
} from "@/components/workspace/states";
import { myProjectsQuery, myTicketsQuery, ticketMessagesQuery } from "@/lib/workspace/queries";
import {
  formatDateTime,
  label,
  ticketCategoryLabels,
  ticketPriorityLabels,
  ticketStatusLabels,
} from "@/lib/workspace/labels";

export const Route = createFileRoute("/_authenticated/dashboard/support")({
  component: SupportPage,
});

function SupportPage() {
  const { userId } = useAuth();
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState<string | null>(null);
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("technical");
  const [priority, setPriority] = useState("normal");
  const [projectId, setProjectId] = useState("");
  const [body, setBody] = useState("");
  const [reply, setReply] = useState("");

  const tickets = useQuery({ ...myTicketsQuery(userId ?? ""), enabled: !!userId });
  const projects = useQuery({ ...myProjectsQuery(userId ?? ""), enabled: !!userId });
  const messages = useQuery({ ...ticketMessagesQuery(selected ?? ""), enabled: !!selected });

  const createTicket = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase
        .from("tickets")
        .insert({
          client_id: userId!,
          subject,
          category: category as "technical",
          priority: priority as "normal",
          project_id: projectId || null,
        })
        .select()
        .single();
      if (error) throw new Error(error.message);
      if (body.trim()) {
        await supabase.from("ticket_messages").insert({
          ticket_id: data.id,
          author_id: userId!,
          author_is_staff: false,
          body,
        });
      }
      return data;
    },
    onSuccess: (data) => {
      setSubject("");
      setBody("");
      setSelected(data.id);
      void queryClient.invalidateQueries({ queryKey: ["my-tickets"] });
    },
  });

  const sendReply = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("ticket_messages").insert({
        ticket_id: selected!,
        author_id: userId!,
        author_is_staff: false,
        body: reply,
      });
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      setReply("");
      void queryClient.invalidateQueries({ queryKey: ["ticket-messages", selected] });
    },
  });

  return (
    <>
      <PageHeader title="پشتیبانی" description="ثبت و پیگیری تیکت‌های فنی، مالی و پروژه‌ای." />

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <Panel title="تیکت‌های شما">
          <DataTable
            rows={tickets.data ?? []}
            loading={tickets.isLoading}
            error={tickets.error}
            empty={{ title: "تیکتی ثبت نشده", description: "از فرم کنار، تیکت جدید ثبت کنید." }}
            columns={[
              {
                key: "subject",
                header: "موضوع",
                cell: (row) => (
                  <button
                    type="button"
                    className="text-right font-medium hover:text-brand"
                    onClick={() => setSelected(row.id)}
                  >
                    {row.subject}
                  </button>
                ),
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

        <Panel title="تیکت جدید">
          <form
            className="space-y-3"
            onSubmit={(event) => {
              event.preventDefault();
              createTicket.mutate();
            }}
          >
            <Input label="موضوع" value={subject} onChange={setSubject} required />
            <Select
              label="دسته"
              value={category}
              onChange={setCategory}
              options={Object.entries(ticketCategoryLabels).map(([key, value]) => ({
                value: key,
                label: value.fa,
              }))}
            />
            <Select
              label="اولویت"
              value={priority}
              onChange={setPriority}
              options={Object.entries(ticketPriorityLabels).map(([key, value]) => ({
                value: key,
                label: value.fa,
              }))}
            />
            <Select
              label="پروژه مرتبط"
              value={projectId}
              onChange={setProjectId}
              options={[
                { value: "", label: "بدون پروژه" },
                ...(projects.data ?? []).map((project) => ({
                  value: project.id,
                  label: project.name,
                })),
              ]}
            />
            <label className="block">
              <span className="mb-1 block text-xs text-muted-foreground">شرح</span>
              <textarea
                value={body}
                onChange={(event) => setBody(event.target.value)}
                rows={4}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-brand"
              />
            </label>
            {createTicket.isError && (
              <p className="text-xs text-destructive">ثبت تیکت انجام نشد. دوباره تلاش کنید.</p>
            )}
            {createTicket.isSuccess && <p className="text-xs text-chart-5">تیکت ثبت شد.</p>}
            <button
              type="submit"
              disabled={createTicket.isPending}
              className="rounded-md bg-foreground px-4 py-2 text-sm text-background disabled:opacity-60"
            >
              {createTicket.isPending ? "در حال ثبت…" : "ثبت تیکت"}
            </button>
          </form>
        </Panel>

        <Panel title="گفت‌وگوی تیکت" className="lg:col-span-2">
          {!selected ? (
            <EmptyState title="یک تیکت را انتخاب کنید" />
          ) : messages.isLoading ? (
            <LoadingState rows={3} />
          ) : (
            <div className="space-y-3">
              {(messages.data ?? []).length === 0 && <EmptyState title="پیامی ثبت نشده" />}
              {(messages.data ?? []).map((message) => (
                <div
                  key={message.id}
                  className={`rounded-lg border p-3 text-sm ${
                    message.author_is_staff ? "border-brand/40 bg-brand/5" : "border-border"
                  }`}
                >
                  <p className="text-xs text-muted-foreground">
                    {message.author_is_staff ? "تیم رای‌کد" : "شما"} —{" "}
                    {formatDateTime(message.created_at)}
                  </p>
                  <p className="mt-2 whitespace-pre-line leading-7">{message.body}</p>
                </div>
              ))}
              <form
                className="flex gap-2"
                onSubmit={(event) => {
                  event.preventDefault();
                  if (reply.trim()) sendReply.mutate();
                }}
              >
                <input
                  value={reply}
                  onChange={(event) => setReply(event.target.value)}
                  placeholder="پاسخ شما…"
                  className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-brand"
                />
                <button
                  type="submit"
                  className="rounded-md bg-foreground px-4 py-2 text-sm text-background"
                >
                  ارسال
                </button>
              </form>
            </div>
          )}
        </Panel>
      </div>
    </>
  );
}

function Input({
  label: labelText,
  value,
  onChange,
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs text-muted-foreground">{labelText}</span>
      <input
        value={value}
        required={required}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-brand"
      />
    </label>
  );
}

function Select({
  label: labelText,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs text-muted-foreground">{labelText}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-brand"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
