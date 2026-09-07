import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/workspace/shell";
import { DataTable, Metric, Panel, StatusBadge } from "@/components/workspace/states";
import { formatAmount, formatDate, invoiceStatusLabels, label } from "@/lib/workspace/labels";

export const Route = createFileRoute("/_authenticated/admin/invoices")({
  component: InvoicesPage,
});

function InvoicesPage() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ number: "", title: "", client_id: "", total_amount: "" });

  const invoices = useQuery({
    queryKey: ["admin-invoices"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("invoices")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw new Error(error.message);
      return data;
    },
  });

  const clients = useQuery({
    queryKey: ["admin-client-options"],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("id,full_name,email");
      if (error) throw new Error(error.message);
      return data;
    },
  });

  const create = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("invoices").insert({
        number: form.number,
        title: form.title || null,
        client_id: form.client_id,
        total_amount: Number(form.total_amount || 0),
        status: "draft",
      });
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      setForm({ number: "", title: "", client_id: "", total_amount: "" });
      setOpen(false);
      void queryClient.invalidateQueries({ queryKey: ["admin-invoices"] });
    },
  });

  const setStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const patch: Record<string, unknown> = { status };
      if (status === "issued") patch["issued_at"] = new Date().toISOString();
      const { error } = await supabase.from("invoices").update(patch as never).eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-invoices"] }),
  });

  const rows = invoices.data ?? [];
  const total = rows.reduce((sum, row) => sum + Number(row.total_amount ?? 0), 0);
  const paid = rows
    .filter((row) => row.status === "paid")
    .reduce((sum, row) => sum + Number(row.total_amount ?? 0), 0);

  return (
    <>
      <PageHeader
        title="صورتحساب‌ها"
        description="صدور و پیگیری صورتحساب. پرداخت‌ها به‌صورت دستی ثبت می‌شوند؛ درگاه پرداختی متصل نیست."
        actions={
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="rounded-md border border-border px-3 py-1.5 text-xs hover:bg-muted"
          >
            {open ? "بستن" : "صورتحساب جدید"}
          </button>
        }
      />

      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <Metric label="جمع صورتحساب‌ها" value={formatAmount(total)} />
        <Metric label="پرداخت‌شده" value={formatAmount(paid)} />
        <Metric label="مانده" value={formatAmount(total - paid)} />
      </div>

      {open && (
        <Panel className="mb-6">
          <form
            className="grid gap-3 md:grid-cols-4"
            onSubmit={(event) => {
              event.preventDefault();
              create.mutate();
            }}
          >
            <input
              required
              placeholder="شماره"
              value={form.number}
              onChange={(event) => setForm({ ...form, number: event.target.value })}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
            <input
              placeholder="عنوان"
              value={form.title}
              onChange={(event) => setForm({ ...form, title: event.target.value })}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
            <select
              required
              value={form.client_id}
              onChange={(event) => setForm({ ...form, client_id: event.target.value })}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">مشتری</option>
              {(clients.data ?? []).map((client) => (
                <option key={client.id} value={client.id}>
                  {client.full_name ?? client.email}
                </option>
              ))}
            </select>
            <input
              required
              type="number"
              placeholder="مبلغ (تومان)"
              value={form.total_amount}
              onChange={(event) => setForm({ ...form, total_amount: event.target.value })}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
            <button
              type="submit"
              className="rounded-md bg-foreground px-4 py-2 text-sm text-background md:col-span-4 md:w-32"
            >
              ثبت
            </button>
            {create.isError && (
              <p className="text-xs text-destructive md:col-span-4">
                {(create.error as Error).message}
              </p>
            )}
          </form>
        </Panel>
      )}

      <Panel>
        <DataTable
          rows={rows}
          loading={invoices.isLoading}
          error={invoices.error}
          empty={{ title: "صورتحسابی ثبت نشده" }}
          columns={[
            { key: "number", header: "شماره", cell: (row) => row.number },
            {
              key: "client",
              header: "مشتری",
              cell: (row) =>
                (clients.data ?? []).find((client) => client.id === row.client_id)?.full_name ??
                "—",
            },
            { key: "amount", header: "مبلغ", cell: (row) => formatAmount(row.total_amount) },
            { key: "due", header: "سررسید", cell: (row) => formatDate(row.due_date) },
            {
              key: "status",
              header: "وضعیت",
              cell: (row) => {
                const value = label(invoiceStatusLabels, row.status);
                return <StatusBadge tone={value.tone}>{value.fa}</StatusBadge>;
              },
            },
            {
              key: "actions",
              header: "",
              cell: (row) => (
                <select
                  value={row.status}
                  onChange={(event) =>
                    setStatus.mutate({ id: row.id, status: event.target.value })
                  }
                  className="rounded-md border border-input bg-background px-2 py-1 text-xs"
                >
                  {Object.entries(invoiceStatusLabels).map(([value, item]) => (
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
