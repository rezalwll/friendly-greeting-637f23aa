import { createFileRoute } from "@tanstack/react-router";

import { Collection } from "@/components/workspace/collection";
import { PageHeader } from "@/components/workspace/shell";

export const Route = createFileRoute("/_authenticated/admin/authors")({
  component: AuthorsPage,
});

function AuthorsPage() {
  return (
    <>
      <PageHeader title="نویسندگان" description="نویسندگان مقاله‌های وبلاگ." />
      <Collection
        table="authors"
        title="فهرست نویسندگان"
        emptyTitle="نویسنده‌ای ثبت نشده"
        fields={[
          { name: "name_fa", label: "نام (فارسی)", required: true },
          { name: "name_en", label: "Name (English)" },
          { name: "bio_fa", label: "معرفی (فارسی)", type: "textarea" },
          { name: "bio_en", label: "Bio (English)", type: "textarea" },
          { name: "avatar_url", label: "نشانی تصویر" },
        ]}
        columns={[
          { key: "name", header: "نام", cell: (row) => String(row["name_fa"] ?? "") },
          { key: "en", header: "English", cell: (row) => String(row["name_en"] ?? "—") },
        ]}
      />
    </>
  );
}
