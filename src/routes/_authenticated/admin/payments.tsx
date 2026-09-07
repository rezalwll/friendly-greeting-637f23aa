import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/workspace/shell";
import { DataTable, Panel } from "@/components/workspace/states";
import { formatAmount, formatDate } from "@/lib/workspace/labels";

export const Route = createFileRoute("/_authenticated/admin/payments")({
  component: PaymentsPage,
});

function PaymentsPage() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ invoice_id: "", amount: "", method: "card", reference: "" });

  const payments = useQuery({
    queryKey: ["admin-payments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payments")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw new Error(error.message);
      return data;
    },
  });

  const invoices = useQuery({
    queryKey: ["admin-invoice-options"],
    queryFn: async () => {
      const { data, error } = await supabase.from("invoices").select("id,number,client_id");
      if (error) throw new Error(error.message);
      return data;
    },
  });

  const record = useMutation({
    mutationFn: async () => {
      const invoice = (invoices.data ?? []).find((item) => item.id === form.invoice_id);
      const { error } = await supabase.from("payments").insert({
        invoice_id: form.invoice_id,
        client_id: invoice?.client_id ?? null,
        amount: Number(form.amount || 0),
        method: form.method,
        reference: form.reference || null,
        paid_at: new Date().toISOString(),
      });
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      setForm({ invoice_id: "", amount: "", method: "card", reference: "" });
      void queryClient.invalidateQueries({ queryKey: ["admin-payments"] });
    },
  });

  return (
    <>
      <PageHeader
        title="پرداخت‌ها"
        description="ثبت دستی پرداخت‌های دریافتی. مرز اتصال به درگاه پرداخت آماده است اما هیچ درگاهی وصل نیست."
      />

      <Panel className="mb-6" title="ثبت پرداخت دستی">
        <form
          className="grid gap-3 md:grid-cols-5"
          onSubmit={(event) => {
            event.preventDefault();
            record.mutate();
          }}
        >
          <select
            required
            value={form.invoice_id}
            onChange={(event) => setForm({ ...form, invoice_id: event.target.value })}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="">صورتحساب</option>
            {(invoices.data ?? []).map((invoice) => (
              <option key={invoice.id} value={invoice.id}>
                {invoice.number}
              </option>
            ))}
          </select>
          <input
            required
            type="number"
            placeholder="مبلغ"
            value={form.amount}
            onChange={(event) => setForm({ ...form, amount: event.target.value })}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
          <select
            value={form.method}
            onChange={(event) => setForm({ ...form, method: event.target.value })}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="card">کارت به کارت</option>
            <option value="transfer">حواله بانکی</option>
            <option value="cash">نقدی</option>
          </select>
          <input
            placeholder="شماره پیگیری"
            value={form.reference}
            onChange={(event) => setForm({ ...form, reference: event.target.value })}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
          <button type="submit" className="rounded-md bg-foreground px-4 py-2 text-sm text-background">
            ثبت
          </button>
          {record.isError && (
            <p className="md:col-span-5 text-xs text-destructive">
              {(record.error as Error).message}
            </p>
          )}
        </form>
      </Panel>

      <Panel title="پرداخت‌های ثبت‌شده">
        <DataTable
          rows={payments.data ?? []}
          loading={payments.isLoading}
          error={payments.error}
          empty={{ title: "پرداختی ثبت نشده" }}
          columns={[
            { key: "amount", header: "مبلغ", cell: (row) => formatAmount(row.amount) },
            { key: "method", header: "روش", cell: (row) => row.method ?? "—" },
            { key: "ref", header: "پیگیری", cell: (row) => row.reference ?? "—" },
            { key: "paid", header: "تاریخ", cell: (row) => formatDate(row.paid_at) },
          ]}
        />
      </Panel>
    </>
  );
}
