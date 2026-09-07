import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/workspace/shell";
import { DataTable, EmptyState, LoadingState, Metric, Panel } from "@/components/workspace/states";

export const Route = createFileRoute("/_authenticated/admin/seo/health")({
  component: SeoHealthPage,
});

type Issue = { id: string; kind: string; title: string; problem: string };

function SeoHealthPage() {
  const health = useQuery({
    queryKey: ["seo-health"],
    queryFn: async () => {
      const [{ data: content, error }, { data: articles }] = await Promise.all([
        supabase.from("content_items").select("*"),
        supabase.from("articles").select("*"),
      ]);
      if (error) throw new Error(error.message);

      const issues: Issue[] = [];
      const seen = new Map<string, number>();

      for (const item of content ?? []) {
        seen.set(item.slug, (seen.get(item.slug) ?? 0) + 1);
        if (!item.seo_title) issues.push(mk(item.id, "محتوا", item.title_fa, "عنوان سئو ندارد"));
        if (!item.seo_description)
          issues.push(mk(item.id, "محتوا", item.title_fa, "توضیح سئو ندارد"));
        if (item.translation_state === "missing")
          issues.push(mk(item.id, "محتوا", item.title_fa, "نسخه انگلیسی ندارد"));
      }
      for (const item of articles ?? []) {
        seen.set(item.slug, (seen.get(item.slug) ?? 0) + 1);
        if (!item.seo_title) issues.push(mk(item.id, "مقاله", item.title_fa, "عنوان سئو ندارد"));
        if (!item.excerpt_fa) issues.push(mk(item.id, "مقاله", item.title_fa, "خلاصه ندارد"));
      }
      for (const [slug, count] of seen) {
        if (count > 1) issues.push(mk(slug, "نشانی", slug, "نشانی تکراری"));
      }

      return {
        issues,
        contentCount: (content ?? []).length,
        articleCount: (articles ?? []).length,
      };
    },
  });

  return (
    <>
      <PageHeader
        title="سلامت محتوا"
        description="بررسی داخلی بر اساس داده‌های خودِ سایت؛ هیچ سرویس بیرونی مثل سرچ کنسول متصل نیست."
      />

      {health.isLoading ? (
        <LoadingState rows={3} />
      ) : (
        <>
          <div className="mb-6 grid gap-3 sm:grid-cols-3">
            <Metric label="صفحه‌های محتوایی" value={health.data?.contentCount ?? 0} />
            <Metric label="مقاله‌ها" value={health.data?.articleCount ?? 0} />
            <Metric
              label="ایرادهای شناسایی‌شده"
              value={health.data?.issues.length ?? 0}
              tone={health.data?.issues.length ? "danger" : "neutral"}
            />
          </div>

          <Panel title="فهرست ایرادها">
            {(health.data?.issues ?? []).length === 0 ? (
              <EmptyState title="ایرادی پیدا نشد" />
            ) : (
              <DataTable
                rows={(health.data?.issues ?? []).map((issue, index) => ({
                  ...issue,
                  id: `${issue.id}-${index}`,
                }))}
                empty={{ title: "ایرادی پیدا نشد" }}
                columns={[
                  { key: "kind", header: "نوع", cell: (row) => row.kind },
                  { key: "title", header: "عنوان", cell: (row) => row.title },
                  { key: "problem", header: "ایراد", cell: (row) => row.problem },
                ]}
              />
            )}
          </Panel>
        </>
      )}
    </>
  );
}

function mk(id: string, kind: string, title: string, problem: string): Issue {
  return { id, kind, title, problem };
}
