import { createFileRoute } from "@tanstack/react-router";

import { Collection } from "@/components/workspace/collection";
import { PageHeader } from "@/components/workspace/shell";
import { contentStatusLabels, translationStateLabels } from "@/lib/workspace/labels";

export const Route = createFileRoute("/_authenticated/admin/faqs")({
  component: FaqsPage,
});

const options = (dict: Record<string, { fa: string }>) =>
  Object.entries(dict).map(([value, item]) => ({ value, label: item.fa }));

function FaqsPage() {
  return (
    <>
      <PageHeader
        title="پرسش‌های متداول"
        description="پرسش‌ها می‌توانند به یک بستر مشخص (خدمت، صنعت، صفحه) نسبت داده شوند."
      />
      <Collection
        table="faqs"
        title="فهرست پرسش‌ها"
        orderBy="position"
        ascending
        emptyTitle="پرسشی ثبت نشده"
        emptyDescription="اولین پرسش متداول را اضافه کنید تا در صفحه‌های عمومی نمایش داده شود."
        fields={[
          { name: "question_fa", label: "پرسش (فارسی)", required: true },
          { name: "question_en", label: "Question (English)" },
          { name: "answer_fa", label: "پاسخ (فارسی)", type: "textarea", required: true },
          { name: "answer_en", label: "Answer (English)", type: "textarea" },
          { name: "context", label: "بستر", help: "مثلاً service:seo یا industry:medical" },
          { name: "position", label: "ترتیب", type: "number" },
          { name: "status", label: "وضعیت", type: "select", options: options(contentStatusLabels) },
          {
            name: "translation_state",
            label: "وضعیت ترجمه",
            type: "select",
            options: options(translationStateLabels),
          },
        ]}
        columns={[
          { key: "q", header: "پرسش", cell: (row) => String(row["question_fa"] ?? "") },
          { key: "context", header: "بستر", cell: (row) => String(row["context"] ?? "—") },
          { key: "status", header: "وضعیت", cell: (row) => String(row["status"] ?? "") },
          { key: "position", header: "ترتیب", cell: (row) => String(row["position"] ?? 0) },
        ]}
      />
    </>
  );
}
