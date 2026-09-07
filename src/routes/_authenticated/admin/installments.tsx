import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";
import { Collection } from "@/components/workspace/collection";
import { PageHeader } from "@/components/workspace/shell";
import { Metric } from "@/components/workspace/states";
import { formatAmount, installmentStatusLabels } from "@/lib/workspace/labels";

export const Route = createFileRoute("/_authenticated/admin/installments")({
  component: InstallmentsPage,
});

function InstallmentsPage() {
  const queryClient = useQueryClient();

  const invoices = useQuery({
    queryKey: ["admin-invoice-options"],
    queryFn: async () => {
      const { data, error } = await supabase.from("invoices").select("id,number");
      if (error) throw new Error(error.message);
      return data;
    },
  });

  const summary = useQuery({
    queryKey: ["installment-summary"],
    queryFn: async () => {
      const { data, error } = await supabase.from("installments").select("amount,status");
      if (error) throw new Error(error.message);
      const rows = data ?? [];
      return {
        overdue: rows
          .filter((row) => row.status === "overdue")
          .reduce((sum, row) => sum + Number(row.amount), 0),
        upcoming: rows
          .filter((row) => row.status === "upcoming" || row.status === "due")
          .reduce((sum, row) => sum + Number(row.amount), 0),
        paid: rows
          .filter((row) => row.status === "paid")
          .reduce((sum, row) => sum + Number(row.amount), 0),
      };
    },
  });

  const sweep = useMutation({
    mutationFn: async () => {
      const today = new Date().toISOString().slice(0, 10);
      const { error } = await supabase
        .from("installments")
        .update({ status: "overdue" })
        .lt("due_date", today)
        .in("status", ["upcoming", "due"]);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["installment-summary"] });
      void queryClient.invalidateQueries({ queryKey: ["admin", "installments"] });
    },
  });

  return (
    <>
      <PageHeader
        title="اقساط"
        description="تقسیم مبلغ هر صورتحساب به مراحل پرداخت مرتبط با پیشرفت پروژه."
        actions={
          <button
            type="button"
            onClick={() => sweep.mutate()}
            className="rounded-md border border-border px-3 py-1.5 text-xs hover:bg-muted"
          >
            بروزرسانی اقساط سررسیدگذشته
          </button>
        }
      />

      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <Metric label="معوق" value={formatAmount(summary.data?.overdue ?? 0)} tone="danger" />
        <Metric label="پیش‌رو" value={formatAmount(summary.data?.upcoming ?? 0)} />
        <Metric label="پرداخت‌شده" value={formatAmount(summary.data?.paid ?? 0)} />
      </div>

      <Collection
        table="installments"
        title="فهرست اقساط"
        orderBy="due_date"
        ascending
        emptyTitle="قسطی ثبت نشده"
        emptyDescription="ابتدا یک صورتحساب بسازید، سپس اقساط آن را اینجا تعریف کنید."
        fields={[
          {
            name: "invoice_id",
            label: "صورتحساب",
            type: "select",
            required: true,
            options: (invoices.data ?? []).map((invoice) => ({
              value: invoice.id,
              label: invoice.number,
            })),
          },
          { name: "label", label: "عنوان قسط", required: true },
          { name: "amount", label: "مبلغ", type: "number", required: true },
          { name: "due_date", label: "سررسید", help: "قالب ۲۰۲۶-۰۱-۳۱" },
          { name: "position", label: "ترتیب", type: "number" },
          {
            name: "status",
            label: "وضعیت",
            type: "select",
            options: Object.entries(installmentStatusLabels).map(([value, item]) => ({
              value,
              label: item.fa,
            })),
          },
          { name: "internal_note", label: "یادداشت داخلی", type: "textarea" },
        ]}
        columns={[
          { key: "label", header: "قسط", cell: (row) => String(row.label ?? "") },
          { key: "amount", header: "مبلغ", cell: (row) => formatAmount(Number(row.amount ?? 0)) },
          { key: "due", header: "سررسید", cell: (row) => String(row.due_date ?? "—") },
          { key: "status", header: "وضعیت", cell: (row) => String(row.status ?? "") },
        ]}
      />
    </>
  );
}
