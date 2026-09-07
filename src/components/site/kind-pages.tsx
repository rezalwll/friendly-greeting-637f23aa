import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import {
  Breadcrumbs,
  DetailBody,
  DetailCta,
  EmptyState,
  ItemCard,
  PageHeader,
  PageShell,
  Pagination,
  SearchField,
} from "@/components/site/collection";
import { CtaLink } from "@/components/site/primitives";
import { contentItemQuery, contentListQuery, type ContentKind } from "@/lib/public-content";

function Skeleton() {
  return (
    <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-44 animate-pulse rounded-lg border border-border bg-secondary/50" />
      ))}
    </div>
  );
}

export function ContentListPage({
  kind,
  detailTo,
  eyebrow,
  title,
  lead,
  searchLabel,
  emptyTitle,
  emptyHint,
}: {
  kind: ContentKind;
  detailTo: string;
  eyebrow: string;
  title: string;
  lead: string;
  searchLabel: string;
  emptyTitle: string;
  emptyHint: string;
}) {
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const { data, isPending, isError } = useQuery(contentListQuery(kind, { page, q }));

  return (
    <PageShell>
      <Breadcrumbs items={[{ label: title }]} />
      <PageHeader eyebrow={eyebrow} title={title} lead={lead}>
        <SearchField
          value={q}
          label={searchLabel}
          onChange={(v) => {
            setQ(v);
            setPage(1);
          }}
        />
      </PageHeader>

      {isPending ? (
        <Skeleton />
      ) : isError ? (
        <div className="mt-10">
          <EmptyState
            title="بارگذاری انجام نشد"
            hint="اتصال به پایگاه‌داده داخلی برقرار نشد. لطفاً صفحه را دوباره باز کنید."
          />
        </div>
      ) : data.rows.length === 0 ? (
        <div className="mt-10">
          <EmptyState title={emptyTitle} hint={emptyHint} />
        </div>
      ) : (
        <>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {data.rows.map((row) => (
              <ItemCard
                key={row.id}
                to={detailTo}
                slug={row.slug}
                title={row.title_fa}
                summary={row.summary_fa}
              />
            ))}
          </div>
          <Pagination page={page} total={data.total} onPage={setPage} />
        </>
      )}

      <div className="mt-14 flex flex-wrap gap-3 border-t border-border pt-10">
        <CtaLink to="/start-project">شروع پروژه</CtaLink>
        <CtaLink to="/contact" variant="outline">
          مشاوره رایگان
        </CtaLink>
      </div>
    </PageShell>
  );
}

export function ContentDetailPage({
  kind,
  slug,
  listTo,
  listLabel,
}: {
  kind: ContentKind;
  slug: string;
  listTo: string;
  listLabel: string;
}) {
  const { data, isPending, isError } = useQuery(contentItemQuery(kind, slug));

  if (isPending) {
    return (
      <PageShell>
        <div className="h-64 animate-pulse rounded-lg border border-border bg-secondary/50" />
      </PageShell>
    );
  }

  if (isError || !data) {
    return (
      <PageShell>
        <Breadcrumbs items={[{ label: listLabel, to: listTo }, { label: "یافت نشد" }]} />
        <EmptyState
          title="این صفحه هنوز منتشر نشده است"
          hint="محتوای این نشانی در مدیریت محتوا ساخته یا منتشر نشده است."
        />
        <div className="mt-8">
          <CtaLink to="/contact" variant="outline">
            تماس با رای‌کد
          </CtaLink>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <article>
        <Breadcrumbs items={[{ label: listLabel, to: listTo }, { label: data.title_fa }]} />
        <h1 className="max-w-3xl text-[1.9rem] leading-[1.35] font-bold sm:text-4xl">
          {data.title_fa}
        </h1>
        {data.summary_fa && (
          <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground">
            {data.summary_fa}
          </p>
        )}
        <DetailBody body={data.body_fa} />
      </article>
      <DetailCta />
    </PageShell>
  );
}
