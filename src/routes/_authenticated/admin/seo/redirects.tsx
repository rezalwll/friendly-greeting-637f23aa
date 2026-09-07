import { createFileRoute } from "@tanstack/react-router";

import { Collection } from "@/components/workspace/collection";
import { PageHeader } from "@/components/workspace/shell";

export const Route = createFileRoute("/_authenticated/admin/seo/redirects")({
  component: RedirectsPage,
});

function RedirectsPage() {
  return (
    <>
      <PageHeader
        title="ریدایرکت‌ها"
        description="نگاشت نشانی‌های قدیمی به جدید؛ در فاز بعد به مسیریابی سایت وصل می‌شود."
      />
      <Collection
        table="redirects"
        title="فهرست ریدایرکت‌ها"
        emptyTitle="ریدایرکتی ثبت نشده"
        fields={[
          { name: "old_url", label: "نشانی قدیمی", required: true },
          { name: "new_url", label: "نشانی جدید", required: true },
          {
            name: "type",
            label: "نوع",
            type: "select",
            options: [
              { value: "301", label: "۳۰۱ — دائمی" },
              { value: "302", label: "۳۰۲ — موقت" },
            ],
          },
          { name: "active", label: "فعال", type: "boolean" },
        ]}
        columns={[
          { key: "old", header: "قدیمی", cell: (row) => String(row.old_url ?? "") },
          { key: "new", header: "جدید", cell: (row) => String(row.new_url ?? "") },
          { key: "type", header: "نوع", cell: (row) => String(row.type ?? "") },
          { key: "active", header: "فعال", cell: (row) => (row.active ? "بله" : "خیر") },
        ]}
      />
    </>
  );
}
