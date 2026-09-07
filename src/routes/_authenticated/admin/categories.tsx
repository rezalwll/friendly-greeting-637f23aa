import { createFileRoute } from "@tanstack/react-router";

import { Collection } from "@/components/workspace/collection";
import { PageHeader } from "@/components/workspace/shell";

export const Route = createFileRoute("/_authenticated/admin/categories")({
  component: CategoriesPage,
});

function CategoriesPage() {
  return (
    <>
      <PageHeader title="دسته‌ها" description="دسته‌بندی مقاله‌های وبلاگ." />
      <Collection
        table="categories"
        title="فهرست دسته‌ها"
        emptyTitle="دسته‌ای ثبت نشده"
        fields={[
          { name: "name_fa", label: "نام (فارسی)", required: true },
          { name: "name_en", label: "Name (English)" },
          { name: "slug", label: "نشانی (slug)", required: true },
          { name: "description_fa", label: "توضیح", type: "textarea" },
        ]}
        columns={[
          { key: "name", header: "نام", cell: (row) => String(row.name_fa ?? "") },
          { key: "slug", header: "نشانی", cell: (row) => String(row.slug ?? "") },
        ]}
      />
    </>
  );
}
