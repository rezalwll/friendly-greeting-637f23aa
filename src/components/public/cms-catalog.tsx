import { ArrowUpLeft, ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { Container } from "@/components/site/primitives";
import { kindCopy, localize, type CatalogKind } from "@/content/catalog";
import type { Locale } from "@/i18n/routing";
import type { PublicCatalogEntry } from "@/server/queries/public-content";

import { FinalBand, localizedHref, PageHero } from "./shared";

export function PublicContentCards({
  locale,
  entries,
}: {
  locale: Locale;
  entries: PublicCatalogEntry[];
}) {
  const Arrow = locale === "fa" ? ArrowUpLeft : ArrowUpRight;
  if (!entries.length) {
    return (
      <p className="border-y border-hairline py-12 text-muted-foreground">
        {locale === "fa" ? "محتوایی برای نمایش وجود ندارد." : "No content is available yet."}
      </p>
    );
  }
  return (
    <div className="grid border-t border-s border-hairline md:grid-cols-2 xl:grid-cols-3">
      {entries.map(({ entry }, index) => (
        <Link
          key={`${entry.kind}/${entry.slug}`}
          href={localizedHref(locale, `/${entry.kind}/${entry.slug}`)}
          className="group relative min-h-80 border-e border-b border-hairline bg-background p-7 transition-colors hover:bg-surface sm:p-9"
        >
          <div className="flex items-start justify-between gap-6">
            <span className="meta-label text-muted-foreground">
              {String(index + 1).padStart(2, "0")} / {localize(entry.eyebrow, locale)}
            </span>
            <span className="grid size-10 place-items-center rounded-[5px] border border-foreground/20 transition-colors group-hover:border-brand group-hover:bg-brand group-hover:text-brand-foreground">
              <Arrow className="size-4" aria-hidden />
            </span>
          </div>
          <h2 className="display-3 mt-16">{localize(entry.title, locale)}</h2>
          <p className="mt-5 max-w-md text-sm leading-7 text-muted-foreground">
            {localize(entry.summary, locale)}
          </p>
          {entry.conceptual && (
            <span className="mt-7 inline-flex rounded-full border border-brand/35 bg-brand-soft px-3 py-1 text-xs font-semibold text-brand">
              {locale === "fa" ? "مطالعه مفهومی" : "Concept study"}
            </span>
          )}
        </Link>
      ))}
    </div>
  );
}

export function PublicCatalogHub({
  locale,
  kind,
  entries,
}: {
  locale: Locale;
  kind: CatalogKind;
  entries: PublicCatalogEntry[];
}) {
  const copy = kindCopy[kind];
  return (
    <>
      <PageHero
        locale={locale}
        eyebrow={localize(copy.eyebrow, locale)}
        title={localize(copy.title, locale)}
        lead={localize(copy.lead, locale)}
        aside={
          <>
            <span className="meta-label block text-foreground">
              {String(entries.length).padStart(2, "0")} / {kind.toUpperCase()}
            </span>
            <Link
              className="brand-underline mt-4 inline-flex font-semibold"
              href={localizedHref(locale, "/search")}
            >
              {locale === "fa" ? "جست‌وجوی سایت" : "Search the site"}
            </Link>
          </>
        }
      />
      <section className="py-16 sm:py-24">
        <Container>
          <PublicContentCards locale={locale} entries={entries} />
        </Container>
      </section>
      <FinalBand locale={locale} />
    </>
  );
}
