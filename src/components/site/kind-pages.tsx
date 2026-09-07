import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";

import {
  Breadcrumbs,
  DetailBody,
  EmptyState,
  ItemCard,
  PageHeader,
  PageShell,
  Pagination,
  SearchField,
} from "@/components/site/collection";
import { CtaLink, Eyebrow } from "@/components/site/primitives";
import {
  articleListQuery,
  contentItemQuery,
  contentListQuery,
  publicFaqsQuery,
  type ContentKind,
} from "@/lib/public-content";
import { pick, useLocale, type Locale } from "@/lib/i18n";
import type { AppPath } from "@/lib/nav-content";

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
  intro,
  outro,
}: {
  kind: ContentKind;
  detailTo: string;
  eyebrow: string;
  title: string;
  lead: string;
  searchLabel: string;
  emptyTitle: string;
  emptyHint: string;
  /** Optional editorial hero rendered above the content index. */
  intro?: ReactNode;
  outro?: ReactNode;
}) {
  const locale = useLocale();
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const { data, isPending, isError } = useQuery(contentListQuery(kind, { page, q }));

  return (
    <>
      <PageShell>
        <Breadcrumbs items={[{ label: title }]} />
        {intro}
        <div className={intro ? "mt-20" : undefined}>
          <PageHeader eyebrow={intro ? "فهرست کامل" : eyebrow} title={title} lead={lead}>
            <SearchField
              value={q}
              label={searchLabel}
              onChange={(v) => {
                setQ(v);
                setPage(1);
              }}
            />
          </PageHeader>
        </div>

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
                  title={pick(locale, row.title_fa, row.title_en)}
                  summary={pick(locale, row.summary_fa, row.summary_en) || null}
                />
              ))}
            </div>
            <Pagination page={page} total={data.total} onPage={setPage} />
          </>
        )}
      </PageShell>
      {outro}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Reusable rich detail template                                       */
/* ------------------------------------------------------------------ */

type RelatedKind = { kind: ContentKind; label: string; to: string };

const relatedByKind: Record<string, RelatedKind[]> = {
  service: [
    { kind: "solution", label: "راهکارهای مرتبط", to: "/solutions/$slug" },
    { kind: "problem", label: "مشکلاتی که حل می‌کند", to: "/problems/$slug" },
    { kind: "industry", label: "صنایع مرتبط", to: "/industries/$slug" },
  ],
  solution: [
    { kind: "industry", label: "صنایع مرتبط", to: "/industries/$slug" },
    { kind: "service", label: "خدمات مرتبط", to: "/services/$slug" },
    { kind: "integration", label: "یکپارچه‌سازی‌ها", to: "/integrations/$slug" },
  ],
  problem: [
    { kind: "service", label: "خدمات مرتبط", to: "/services/$slug" },
    { kind: "solution", label: "راهکارهای پیشنهادی", to: "/solutions/$slug" },
  ],
  industry: [
    { kind: "solution", label: "راهکارهای پیشنهادی", to: "/solutions/$slug" },
    { kind: "service", label: "خدمات مرتبط", to: "/services/$slug" },
    { kind: "case_study", label: "نمونه‌کارها", to: "/projects/$slug" },
  ],
  integration: [
    { kind: "solution", label: "راهکارهای مرتبط", to: "/solutions/$slug" },
    { kind: "service", label: "خدمات مرتبط", to: "/services/$slug" },
  ],
  case_study: [
    { kind: "service", label: "خدمات به‌کاررفته", to: "/services/$slug" },
    { kind: "industry", label: "صنعت", to: "/industries/$slug" },
  ],
};

const ctaByKind: Record<string, { label: string; to: AppPath; secondaryLabel: string; secondaryTo: AppPath }> = {
  service: { label: "شروع پروژه", to: "/start-project", secondaryLabel: "مشاوره رایگان", secondaryTo: "/contact" },
  solution: { label: "شروع پروژه", to: "/start-project", secondaryLabel: "مشاوره رایگان", secondaryTo: "/contact" },
  problem: { label: "درخواست بررسی فنی", to: "/technical-review", secondaryLabel: "تماس با رای‌کد", secondaryTo: "/contact" },
  industry: { label: "شروع پروژه", to: "/start-project", secondaryLabel: "مشاوره رایگان", secondaryTo: "/contact" },
  integration: { label: "بررسی یکپارچه‌سازی", to: "/technical-review", secondaryLabel: "تماس با رای‌کد", secondaryTo: "/contact" },
  case_study: { label: "شروع پروژه", to: "/start-project", secondaryLabel: "تماس با رای‌کد", secondaryTo: "/contact" },
};

function RelatedRail({ rel, locale, excludeSlug }: { rel: RelatedKind; locale: Locale; excludeSlug: string }) {
  const { data } = useQuery(contentListQuery(rel.kind, { page: 1, q: "" }));
  const rows = (data?.rows ?? []).filter((r) => r.slug !== excludeSlug).slice(0, 3);
  if (rows.length === 0) return null;
  return (
    <section className="border-t border-border pt-8">
      <h2 className="text-sm font-bold tracking-[0.1em] text-brand uppercase">{rel.label}</h2>
      <ul className="mt-4 grid gap-4 sm:grid-cols-3">
        {rows.map((r) => (
          <li key={r.id}>
            <Link
              to={rel.to}
              params={{ slug: r.slug } as never}
              className="block rounded-lg border border-border p-5 transition-colors hover:border-brand/50"
            >
              <span className="text-sm font-bold leading-6">{pick(locale, r.title_fa, r.title_en)}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function RelatedArticles({ locale }: { locale: Locale }) {
  const { data } = useQuery(articleListQuery({ page: 1, q: "" }));
  const rows = (data?.rows ?? []).slice(0, 3);
  if (rows.length === 0) return null;
  return (
    <section className="border-t border-border pt-8">
      <h2 className="text-sm font-bold tracking-[0.1em] text-brand uppercase">مطالب مرتبط</h2>
      <ul className="mt-4 grid gap-4 sm:grid-cols-3">
        {rows.map((r) => (
          <li key={r.id}>
            <Link
              to="/blog/$slug"
              params={{ slug: r.slug }}
              className="block rounded-lg border border-border p-5 transition-colors hover:border-brand/50"
            >
              <span className="text-sm font-bold leading-6">{pick(locale, r.title_fa, null)}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function DetailFaqs() {
  const { data } = useQuery(publicFaqsQuery());
  const rows = (data ?? []).slice(0, 6);
  if (rows.length === 0) return null;
  return (
    <section className="border-t border-border pt-8">
      <h2 className="text-sm font-bold tracking-[0.1em] text-brand uppercase">سوالات متداول</h2>
      <div className="mt-4 divide-y divide-border rounded-lg border border-border">
        {rows.map((f) => (
          <details key={f.id} className="group px-5 py-4">
            <summary className="cursor-pointer list-none text-sm font-semibold marker:hidden">
              {f.question_fa}
            </summary>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">{f.answer_fa}</p>
          </details>
        ))}
      </div>
    </section>
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
  const locale = useLocale();
  const { data, isPending, isError } = useQuery(contentItemQuery(kind, slug));
  const rels = relatedByKind[kind] ?? [];
  const cta = ctaByKind[kind] ?? ctaByKind["service"]!;

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

  const title = pick(locale, data.title_fa, data.title_en);
  const summary = pick(locale, data.summary_fa, data.summary_en);
  const body = locale === "en" ? (data.body_en?.trim() || data.body_fa) : data.body_fa;

  return (
    <PageShell>
      <article>
        <Breadcrumbs items={[{ label: listLabel, to: listTo }, { label: title }]} />
        <Eyebrow>{listLabel}</Eyebrow>
        <h1 className="mt-5 max-w-3xl text-[1.9rem] leading-[1.35] font-bold sm:text-4xl">{title}</h1>
        {summary && (
          <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground">{summary}</p>
        )}
        <div className="mt-8 flex flex-wrap gap-3">
          <CtaLink to={cta.to}>{cta.label}</CtaLink>
          <CtaLink to={cta.secondaryTo} variant="outline">
            {cta.secondaryLabel}
          </CtaLink>
        </div>
        <DetailBody body={body} />
      </article>

      <div className="mt-16 space-y-10">
        {rels.map((rel) => (
          <RelatedRail key={rel.kind} rel={rel} locale={locale} excludeSlug={slug} />
        ))}
        <RelatedArticles locale={locale} />
        <DetailFaqs />
      </div>

      <div className="mt-14 flex flex-wrap gap-3 border-t border-border pt-10">
        <CtaLink to={cta.to}>{cta.label}</CtaLink>
        <CtaLink to={cta.secondaryTo} variant="outline">
          {cta.secondaryLabel}
        </CtaLink>
      </div>
    </PageShell>
  );
}
