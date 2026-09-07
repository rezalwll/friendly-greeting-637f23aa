import { createFileRoute } from "@tanstack/react-router";

import { Collection } from "@/components/workspace/collection";
import { PageHeader } from "@/components/workspace/shell";

export const Route = createFileRoute("/_authenticated/admin/seo/metadata")({
  component: SeoMetadataPage,
});

function SeoMetadataPage() {
  return (
    <>
      <PageHeader
        title="متادیتای سئو"
        description="عنوان، توضیح و کنونیکال هر مسیر عمومی. هیچ ابزار سئوی بیرونی متصل نیست."
      />
      <Collection
        table="seo_metadata"
        title="مسیرها"
        emptyTitle="متادیتایی ثبت نشده"
        emptyDescription="برای هر مسیر عمومی می‌توانید عنوان و توضیح اختصاصی تعریف کنید."
        fields={[
          { name: "path", label: "مسیر", required: true, help: "مثلاً /services" },
          { name: "title_fa", label: "عنوان (فارسی)" },
          { name: "title_en", label: "Title (English)" },
          { name: "description_fa", label: "توضیح (فارسی)", type: "textarea" },
          { name: "description_en", label: "Description (English)", type: "textarea" },
          { name: "canonical_url", label: "کنونیکال" },
          { name: "og_image", label: "تصویر اشتراک‌گذاری" },
          { name: "no_index", label: "عدم ایندکس", type: "boolean" },
        ]}
        columns={[
          { key: "path", header: "مسیر", cell: (row) => String(row.path ?? "") },
          { key: "title", header: "عنوان", cell: (row) => String(row.title_fa ?? "—") },
          { key: "noindex", header: "noindex", cell: (row) => (row.no_index ? "بله" : "خیر") },
        ]}
      />
    </>
  );
}
