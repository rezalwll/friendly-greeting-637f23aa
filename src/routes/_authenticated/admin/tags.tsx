import { createFileRoute } from "@tanstack/react-router";

import { Collection } from "@/components/workspace/collection";
import { PageHeader } from "@/components/workspace/shell";

export const Route = createFileRoute("/_authenticated/admin/tags")({
  component: TagsPage,
});

function TagsPage() {
  return (
    <>
      <PageHeader title="برچسب‌ها" description="برچسب‌های موضوعی مقاله‌ها." />
      <Collection
        table="tags"
        title="فهرست برچسب‌ها"
        emptyTitle="برچسبی ثبت نشده"
        fields={[
          { name: "name_fa", label: "نام (فارسی)", required: true },
          { name: "name_en", label: "Name (English)" },
          { name: "slug", label: "نشانی (slug)", required: true },
        ]}
        columns={[
          { key: "name", header: "نام", cell: (row) => String(row.name_fa ?? "") },
          { key: "slug", header: "نشانی", cell: (row) => String(row.slug ?? "") },
        ]}
      />
    </>
  );
}
