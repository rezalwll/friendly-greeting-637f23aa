import { ArrowUpLeft, ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { Container } from "@/components/site/primitives";
import {
  getCatalogEntries,
  kindCopy,
  localize,
  type CatalogEntry,
  type CatalogKind,
} from "@/content/catalog";
import type { Locale } from "@/i18n/routing";

import { ActionLink, FinalBand, JsonLd, localizedHref, PageHero } from "./shared";

const labels: Record<
  CatalogKind,
  { fa: { item: string; back: string }; en: { item: string; back: string } }
> = {
  services: {
    fa: { item: "خدمت", back: "همه خدمات" },
    en: { item: "Service", back: "All services" },
  },
  solutions: {
    fa: { item: "راهکار", back: "همه راهکارها" },
    en: { item: "Solution", back: "All solutions" },
  },
  problems: {
    fa: { item: "مسئله", back: "همه مسائل" },
    en: { item: "Problem", back: "All problems" },
  },
  industries: {
    fa: { item: "صنعت", back: "همه صنایع" },
    en: { item: "Industry", back: "All industries" },
  },
  integrations: {
    fa: { item: "اتصال", back: "همه اتصال‌ها" },
    en: { item: "Integration", back: "All integrations" },
  },
  projects: {
    fa: { item: "مطالعه", back: "همه مطالعات" },
    en: { item: "Study", back: "All studies" },
  },
  blog: { fa: { item: "مطلب", back: "همه مطالب" }, en: { item: "Article", back: "All articles" } },
};

export function CatalogHub({ locale, kind }: { locale: Locale; kind: CatalogKind }) {
  const copy = kindCopy[kind];
  const entries = getCatalogEntries(kind);
  const Arrow = locale === "fa" ? ArrowUpLeft : ArrowUpRight;

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
            <span className="mt-3 block">
              {locale === "fa"
                ? "این فهرست بر اساس مسئله و خروجی دسته‌بندی شده است."
                : "This collection is organised around problems and outcomes."}
            </span>
          </>
        }
      />
      <section className="py-16 sm:py-24">
        <Container>
          <div className="grid border-t border-s border-hairline md:grid-cols-2 xl:grid-cols-3">
            {entries.map((entry, index) => (
              <Link
                key={entry.slug}
                href={localizedHref(locale, `/${kind}/${entry.slug}`)}
                className="group relative min-h-80 border-e border-b border-hairline bg-background p-7 transition-colors hover:bg-surface sm:p-9"
              >
                <div className="flex items-start justify-between gap-6">
                  <span className="meta-label text-muted-foreground">
                    {String(index + 1).padStart(2, "0")} / {labels[kind][locale].item}
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
        </Container>
      </section>
      <FinalBand locale={locale} />
    </>
  );
}

export function CatalogDetail({ locale, entry }: { locale: Locale; entry: CatalogEntry }) {
  const kindLabel = labels[entry.kind][locale];
  const absolutePath = localizedHref(locale, `/${entry.kind}/${entry.slug}`);

  return (
    <>
      <JsonLd
        value={{
          "@context": "https://schema.org",
          "@type": entry.kind === "blog" ? "Article" : "WebPage",
          name: localize(entry.title, locale),
          description: localize(entry.summary, locale),
          inLanguage: locale === "fa" ? "fa-IR" : "en",
          url: absolutePath,
          ...(entry.kind === "blog" ? { author: { "@type": "Organization", name: "RYCODE" } } : {}),
        }}
      />
      <PageHero
        locale={locale}
        eyebrow={localize(entry.eyebrow, locale)}
        title={localize(entry.title, locale)}
        lead={localize(entry.summary, locale)}
        aside={
          <>
            {entry.conceptual && (
              <strong className="mb-4 block text-brand">
                {locale === "fa" ? "این یک سناریوی مفهومی است." : "This is a concept scenario."}
              </strong>
            )}
            {locale === "fa"
              ? "دامنه و زمان اجرا پس از بررسی وضعیت فعلی مشخص می‌شود."
              : "Scope and timing are determined after reviewing the current state."}
          </>
        }
      />
      <section className="py-16 sm:py-24">
        <Container>
          <Link
            href={localizedHref(locale, `/${entry.kind}`)}
            className="brand-underline inline-flex text-sm font-bold"
          >
            {kindLabel.back}
          </Link>
          <div className="mt-12 border-t border-hairline">
            {entry.sections.map((section, index) => (
              <section
                key={`${entry.slug}-${index}`}
                className="grid gap-8 border-b border-hairline py-12 lg:grid-cols-[15rem_minmax(0,1fr)] lg:py-16"
              >
                <div className="meta-label text-muted-foreground">
                  {String(index + 1).padStart(2, "0")} / {kindLabel.item}
                </div>
                <div className="max-w-3xl">
                  <h2 className="display-3">{localize(section.title, locale)}</h2>
                  {section.body && (
                    <p className="mt-6 text-base leading-8 text-muted-foreground sm:text-lg sm:leading-9">
                      {localize(section.body, locale)}
                    </p>
                  )}
                  {section.items && (
                    <ol className="mt-8 grid gap-0 border-t border-hairline">
                      {section.items.map((item, itemIndex) => (
                        <li
                          key={localize(item, locale)}
                          className="grid grid-cols-[2.5rem_1fr] gap-4 border-b border-hairline py-5 text-base"
                        >
                          <span className="meta-label text-brand">
                            {String(itemIndex + 1).padStart(2, "0")}
                          </span>
                          <span>{localize(item, locale)}</span>
                        </li>
                      ))}
                    </ol>
                  )}
                </div>
              </section>
            ))}
          </div>
          <div className="mt-14 flex flex-wrap gap-3">
            <ActionLink locale={locale} href="/start-project">
              {locale === "fa" ? "گفت‌وگو درباره این مسیر" : "Discuss this path"}
            </ActionLink>
            <ActionLink locale={locale} href={`/${entry.kind}`} secondary>
              {kindLabel.back}
            </ActionLink>
          </div>
        </Container>
      </section>
      <FinalBand locale={locale} />
    </>
  );
}
