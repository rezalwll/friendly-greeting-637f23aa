import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { useAuth } from "@/hooks/use-auth";
import { PageHeader } from "@/components/workspace/shell";
import { DataTable, Panel } from "@/components/workspace/states";
import { myFilesQuery } from "@/lib/workspace/queries";
import { fileCategoryLabels, formatDate, label } from "@/lib/workspace/labels";

export const Route = createFileRoute("/_authenticated/dashboard/files")({
  component: FilesPage,
});

const categories = ["all", ...Object.keys(fileCategoryLabels)];

function FilesPage() {
  const { userId } = useAuth();
  const [category, setCategory] = useState("all");
  const files = useQuery({ ...myFilesQuery(userId ?? ""), enabled: !!userId });

  const rows = (files.data ?? []).filter((file) => category === "all" || file.category === category);

  return (
    <>
      <PageHeader
        title="فایل‌ها"
        description="فقط فایل‌هایی که برای شما به اشتراک گذاشته شده‌اند نمایش داده می‌شود؛ دسترسی روی سرور کنترل می‌شود."
      />

      <div className="mb-5 flex flex-wrap gap-2">
        {categories.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setCategory(key)}
            className={`rounded-full border px-3 py-1 text-xs ${
              category === key
                ? "border-foreground bg-foreground text-background"
                : "border-border text-muted-foreground hover:bg-muted"
            }`}
          >
            {key === "all" ? "همه" : label(fileCategoryLabels, key).fa}
          </button>
        ))}
      </div>

      <Panel>
        <DataTable
          rows={rows}
          loading={files.isLoading}
          error={files.error}
          empty={{
            title: "فایلی در این دسته نیست",
            description: "قرارداد، طرح‌ها و تحویل‌شدنی‌ها پس از اشتراک‌گذاری اینجا قرار می‌گیرند.",
          }}
          columns={[
            { key: "name", header: "نام فایل", cell: (row) => row.name },
            {
              key: "category",
              header: "دسته",
              cell: (row) => label(fileCategoryLabels, row.category).fa,
            },
            {
              key: "size",
              header: "حجم",
              cell: (row) => (row.size_bytes ? `${Math.round(row.size_bytes / 1024)} KB` : "—"),
            },
            { key: "date", header: "تاریخ", cell: (row) => formatDate(row.created_at) },
          ]}
        />
      </Panel>
    </>
  );
}
