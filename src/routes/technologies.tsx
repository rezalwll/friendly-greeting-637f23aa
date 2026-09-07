import { createFileRoute } from "@tanstack/react-router";

import { Breadcrumbs, PageShell } from "@/components/site/collection";
import { Container, CtaLink, Eyebrow, Lead, Section, SectionTitle } from "@/components/site/primitives";

const title = "تکنولوژی‌ها | انتخاب بر اساس پروژه";
const description =
  "تکنولوژی بر اساس پروژه انتخاب می‌شود؛ توانمندی‌های رای‌کد در وب، بک‌اند، محتوا و فروشگاه، داده، زیرساخت، سئو و ابزارهای کسب‌وکار.";

export const Route = createFileRoute("/technologies")({
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

const groups: { title: string; note: string; items: string[] }[] = [
  {
    title: "Web",
    note: "لایه‌ای که کاربر می‌بیند: سرعت، پایداری و سازگاری با موبایل.",
    items: ["React", "TypeScript", "Next.js / SSR", "Tailwind CSS", "Progressive Web App"],
  },
  {
    title: "Backend",
    note: "منطق کسب‌وکار، نقش‌ها و APIها.",
    items: ["Node.js", "PHP", "REST API", "Authentication & Roles", "Background Jobs"],
  },
  {
    title: "CMS & Ecommerce",
    note: "جایی که تیم شما بدون برنامه‌نویس محتوا و محصول را مدیریت می‌کند.",
    items: ["WordPress", "WooCommerce", "Headless CMS", "مدیریت محتوای اختصاصی"],
  },
  {
    title: "Data",
    note: "ساختار داده و گزارش‌گیری قابل اتکا.",
    items: ["PostgreSQL", "MySQL", "طراحی مدل داده", "مهاجرت داده", "گزارش‌گیری داخلی"],
  },
  {
    title: "Infrastructure",
    note: "انتشار پایدار و قابل بازگشت.",
    items: ["Linux Server", "CDN & Caching", "CI/CD", "Backup & Recovery", "Monitoring"],
  },
  {
    title: "SEO & Analytics",
    note: "دیده‌شدن و اندازه‌گیری، به‌عنوان بخشی از توسعه.",
    items: ["Technical SEO", "Core Web Vitals", "Structured Data", "معماری محتوا", "رویدادهای داخلی"],
  },
  {
    title: "Business Tools",
    note: "ابزارهایی که کار روزمره را از حالت دستی خارج می‌کند.",
    items: ["CRM", "پنل مدیریت", "Workflow", "سیستم تیکتینگ", "گزارش مدیریتی"],
  },
];

function Page() {
  return (
    <>
      <PageShell>
        <Breadcrumbs items={[{ label: "تکنولوژی‌ها" }]} />
        <Eyebrow>تکنولوژی‌ها</Eyebrow>
        <h1 className="mt-5 max-w-3xl text-[2rem] leading-[1.35] font-bold sm:text-[2.75rem] sm:leading-[1.25]">
          تکنولوژی بر اساس پروژه انتخاب می‌شود.
        </h1>
        <Lead className="max-w-3xl">
          فهرست زیر برای نمایش نیست؛ توانمندی‌هایی است که واقعاً در پروژه‌ها استفاده می‌شود. انتخاب
          نهایی به مسئله، تیم شما و مسیر توسعه آینده بستگی دارد — نه به مد روز.
        </Lead>
      </PageShell>

      <Section className="border-t border-border">
        <Container>
          <div className="grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
            {groups.map((g) => (
              <div key={g.title} className="bg-background p-7">
                <h2 dir="ltr" className="font-display text-sm font-bold tracking-[0.12em] text-brand uppercase">
                  {g.title}
                </h2>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{g.note}</p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {g.items.map((i) => (
                    <li
                      key={i}
                      className="rounded-full border border-border px-3 py-1 text-xs text-foreground/80"
                    >
                      {i}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <p className="mt-8 max-w-2xl text-sm leading-7 text-muted-foreground">
            اگر ابزاری در این فهرست نیست، لزوماً یعنی مناسب پروژه شما نبوده است. در جلسه شناخت
            درباره گزینه‌ها و دلیل انتخاب هرکدام صحبت می‌کنیم.
          </p>
        </Container>
      </Section>

      <Section className="border-t border-border bg-surface">
        <Container>
          <SectionTitle className="mt-0">درباره انتخاب فنی پروژه‌تان صحبت کنیم</SectionTitle>
          <div className="mt-8 flex flex-wrap gap-3">
            <CtaLink to="/start-project">شروع پروژه</CtaLink>
            <CtaLink to="/process" variant="outline">
              فرآیند کار
            </CtaLink>
          </div>
        </Container>
      </Section>
    </>
  );
}
