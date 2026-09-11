import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { Container, Eyebrow } from "@/components/site/primitives";
import type { Locale } from "@/i18n/routing";

export function localizedHref(locale: Locale, path: string): string {
  const normalized = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  return locale === "en" ? `/en${normalized}` || "/en" : normalized || "/";
}

export function PageHero({
  locale,
  eyebrow,
  title,
  lead,
  aside,
}: {
  locale: Locale;
  eyebrow: string;
  title: string;
  lead: string;
  aside?: ReactNode;
}) {
  return (
    <section className="grid-field grain border-b border-hairline py-20 sm:py-28 lg:py-36">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-end">
          <div className="reveal">
            <Eyebrow>{eyebrow}</Eyebrow>
            <h1 className="display-1 mt-8 max-w-6xl">{title}</h1>
            <p className="mt-8 max-w-3xl text-lg leading-9 text-muted-foreground sm:text-xl">
              {lead}
            </p>
          </div>
          <div className="border-s border-hairline ps-6 text-sm leading-7 text-muted-foreground">
            {aside ??
              (locale === "fa"
                ? "هر پیشنهاد پس از شناخت مسئله، محدودیت‌ها و معیار موفقیت شکل می‌گیرد."
                : "Every recommendation follows an understanding of the problem, constraints and success criteria.")}
          </div>
        </div>
      </Container>
    </section>
  );
}

export function ActionLink({
  locale,
  href,
  children,
  secondary = false,
}: {
  locale: Locale;
  href: string;
  children: ReactNode;
  secondary?: boolean;
}) {
  const Icon = locale === "fa" ? ArrowLeft : ArrowRight;
  return (
    <Link
      href={localizedHref(locale, href)}
      className={
        secondary
          ? "group inline-flex min-h-12 items-center gap-3 rounded-[6px] border border-foreground/25 px-6 text-sm font-bold transition-colors hover:border-foreground hover:bg-foreground/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          : "group inline-flex min-h-12 items-center gap-3 rounded-[6px] bg-brand px-6 text-sm font-bold text-brand-foreground transition-colors hover:bg-brand/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
      }
    >
      {children}
      <Icon className="size-4 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
    </Link>
  );
}

export function FinalBand({ locale }: { locale: Locale }) {
  return (
    <section className="bg-ink py-20 text-ink-foreground sm:py-28">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="meta-label text-brand">RYCODE / START</p>
            <h2 className="display-2 mt-6 max-w-4xl">
              {locale === "fa"
                ? "مسئله را روشن کنیم؛ مسیر فنی بعد از آن مشخص می‌شود."
                : "Clarify the problem first; the engineering path follows."}
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <ActionLink locale={locale} href="/start-project">
              {locale === "fa" ? "شروع پروژه" : "Start a project"}
            </ActionLink>
            <Link
              href={localizedHref(locale, "/contact")}
              className="inline-flex min-h-12 items-center rounded-[6px] border border-white/25 px-6 text-sm font-bold text-white transition-colors hover:border-white"
            >
              {locale === "fa" ? "تماس با ما" : "Contact us"}
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}

export function JsonLd({ value }: { value: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(value).replaceAll("<", "\\u003c") }}
    />
  );
}
