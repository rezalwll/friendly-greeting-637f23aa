import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { useAuth } from "@/hooks/use-auth";
import { PageHeader } from "@/components/workspace/shell";
import { DataTable, Metric, Panel, StatusBadge } from "@/components/workspace/states";
import { myInvoicesQuery } from "@/lib/workspace/queries";
import {
  formatAmount,
  formatDate,
  installmentStatusLabels,
  invoiceStatusLabels,
  label,
} from "@/lib/workspace/labels";

export const Route = createFileRoute("/_authenticated/dashboard/payments")({
  component: PaymentsPage,
});

function PaymentsPage() {
  const { userId } = useAuth();
  const invoices = useQuery({ ...myInvoicesQuery(userId ?? ""), enabled: !!userId });

  const rows = invoices.data ?? [];
  const installments = rows.flatMap((invoice) => invoice.installments ?? []);
  const total = rows.reduce((sum, invoice) => sum + (invoice.total_amount ?? 0), 0);
  const paid = installments
    .filter((item) => item.status === "paid")
    .reduce((sum, item) => sum + item.amount, 0);
  const next = installments
    .filter((item) => item.status === "upcoming" || item.status === "due" || item.status === "overdue")
    .sort((a, b) => (a.due_date ?? "").localeCompare(b.due_date ?? ""))[0];

  return (
    <>
      <PageHeader
        title="پرداخت‌ها"
        description="وضعیت مالی قراردادها. ثبت پرداخت به‌صورت داخلی و دستی توسط تیم رای‌کد انجام می‌شود."
      />

      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Metric label="مجموع قرارداد" value={formatAmount(total)} />
        <Metric label="پرداخت‌شده" value={formatAmount(paid)} />
        <Metric label="مانده" value={formatAmount(Math.max(0, total - paid))} />
        <Metric
          label="پرداخت بعدی"
          value={next ? formatAmount(next.amount) : "—"}
          hint={next ? formatDate(next.due_date) : undefined}
        />
      </div>

      <div className="grid gap-6">
        <Panel title="صورتحساب‌ها">
          <DataTable
            rows={rows}
            loading={invoices.isLoading}
            error={invoices.error}
            empty={{ title: "صورتحسابی صادر نشده" }}
            columns={[
              { key: "number", header: "شماره", cell: (row) => row.number },
              { key: "title", header: "عنوان", cell: (row) => row.title ?? "—" },
              {
                key: "total",
                header: "مبلغ",
                cell: (row) => formatAmount(row.total_amount, row.currency),
              },
              {
                key: "status",
                header: "وضعیت",
                cell: (row) => {
                  const value = label(invoiceStatusLabels, row.status);
                  return <StatusBadge tone={value.tone}>{value.fa}</StatusBadge>;
                },
              },
              { key: "due", header: "سررسید", cell: (row) => formatDate(row.due_date) },
            ]}
          />
        </Panel>

        <Panel title="اقساط">
          <DataTable
            rows={installments}
            loading={invoices.isLoading}
            error={invoices.error}
            empty={{ title: "قسطی تعریف نشده" }}
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
      </div>
    </>
  );
}
