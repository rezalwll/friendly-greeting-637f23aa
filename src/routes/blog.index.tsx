import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

import {
  Breadcrumbs,
  EmptyState,
  PageHeader,
  PageShell,
  Pagination,
  SearchField,
} from "@/components/site/collection";
import { articleListQuery } from "@/lib/public-content";
import { formatDate } from "@/lib/workspace/labels";

const title = "بلاگ رای‌کد | طراحی سایت، سئو، وردپرس و برنامه‌نویسی";
const description = "مقاله‌ها و راهنماهای رای‌کد درباره ساخت، رشد و نگهداری محصولات دیجیتال.";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

function Page() {
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const { data, isPending, isError } = useQuery(articleListQuery({ page, q }));

  return (
    <PageShell>
      <Breadcrumbs items={[{ label: "بلاگ" }]} />
      <PageHeader
        eyebrow="بلاگ"
        title="بلاگ رای‌کد"
        lead="مقاله‌ها از مدیریت محتوای داخلی خوانده می‌شوند؛ ساختار برای هزاران مقاله با جستجو و صفحه‌بندی آماده است."
      >
        <SearchField
          value={q}
          label="جستجو در مقاله‌ها"
          onChange={(v) => {
            setQ(v);
            setPage(1);
          }}
        />
      </PageHeader>

      {isPending ? (
        <div className="mt-10 space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-lg border border-border bg-secondary/50" />
          ))}
        </div>
      ) : isError ? (
        <div className="mt-10">
          <EmptyState
            title="بارگذاری انجام نشد"
            hint="اتصال به پایگاه‌داده داخلی برقرار نشد. لطفاً صفحه را دوباره باز کنید."
          />
        </div>
      ) : data.rows.length === 0 ? (
        <div className="mt-10">
          <EmptyState
            title="هنوز مقاله‌ای منتشر نشده است"
            hint="اولین مقاله را در بخش مدیریت محتوا بنویسید و منتشر کنید تا اینجا نمایش داده شود."
          />
        </div>
      ) : (
        <>
          <ul className="mt-10 divide-y divide-border border-y border-border">
            {data.rows.map((row) => (
              <li key={row.id}>
                <Link
                  to="/blog/$slug"
                  params={{ slug: row.slug }}
                  className="group block py-7 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                >
                  <p className="text-xs text-muted-foreground">
                    {row.published_at ? formatDate(row.published_at) : "پیش‌نویس"}
                  </p>
                  <h2 className="mt-2 text-lg font-bold leading-8 group-hover:text-brand">
                    {row.title_fa}
                  </h2>
                  {row.excerpt_fa && (
                    <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground">
                      {row.excerpt_fa}
                    </p>
                  )}
                </Link>
              </li>
            ))}
          </ul>
          <Pagination page={page} total={data.total} onPage={setPage} />
        </>
      )}
    </PageShell>
  );
}
