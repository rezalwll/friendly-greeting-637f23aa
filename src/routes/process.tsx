import { createFileRoute } from "@tanstack/react-router";

import { Breadcrumbs, PageShell } from "@/components/site/collection";
import { Container, CtaLink, Eyebrow, Lead, Section, SectionTitle } from "@/components/site/primitives";

const title = "فرآیند کار رای‌کد | از شناخت تا رشد";
const description =
  "پروژه از کجا شروع می‌شود و چطور جلو می‌رود؟ نه مرحله از شناخت و تعریف دامنه تا انتشار و پشتیبانی.";

export const Route = createFileRoute("/process")({
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

const stages = [
  {
    en: "Discovery",
    fa: "شناخت",
    body: "وضعیت فعلی، مسئله واقعی، کاربران و محدودیت‌ها بررسی می‌شود. خروجی این مرحله فهرست چیزهایی است که باید حل شوند.",
    out: "جمع‌بندی شناخت",
  },
  {
    en: "Scope",
    fa: "تعریف دامنه",
    body: "مرز پروژه مشخص می‌شود: چه چیزی در نسخه اول هست و چه چیزی نیست. این مرحله جلوی رشد بی‌کنترل پروژه را می‌گیرد.",
    out: "سند دامنه",
  },
  {
    en: "Proposal",
    fa: "پیشنهاد",
    body: "مسیر فنی، زمان‌بندی، مراحل تحویل و مراحل پرداخت به‌صورت شفاف ارائه می‌شود.",
    out: "پیشنهاد فنی و زمان‌بندی",
  },
  {
    en: "UX / Structure",
    fa: "ساختار و تجربه کاربری",
    body: "ساختار صفحات، مسیر کاربر، نقش‌ها و معماری اطلاعات طراحی می‌شود؛ قبل از هر پیکسل یا خط کد.",
    out: "نقشه ساختار",
  },
  {
    en: "Design",
    fa: "طراحی",
    body: "رابط کاربری بر پایه سیستم طراحی ساخته می‌شود تا صفحات آینده هم یکدست بمانند.",
    out: "سیستم طراحی و صفحات کلیدی",
  },
  {
    en: "Development",
    fa: "توسعه",
    body: "پیاده‌سازی در بازه‌های مشخص انجام می‌شود و پیشرفت هر مرحله در پنل مشتری قابل پیگیری است.",
    out: "نسخه‌های قابل بررسی",
  },
  {
    en: "QA",
    fa: "تست و کنترل کیفیت",
    body: "بررسی عملکرد، سازگاری مرورگر و موبایل، سرعت، دسترس‌پذیری و سناریوهای خطا.",
    out: "گزارش تست",
  },
  {
    en: "Launch",
    fa: "انتشار",
    body: "انتقال، تنظیمات دامنه، ریدایرکت‌ها، بررسی ایندکس و تحویل دسترسی‌ها به مالک پروژه.",
    out: "تحویل و مالکیت کامل",
  },
  {
    en: "Support & Growth",
    fa: "پشتیبانی و رشد",
    body: "پایش، رفع مشکل، به‌روزرسانی و توسعه مستمر بر اساس داده‌های واقعی استفاده.",
    out: "چرخه بهبود",
  },
];

function Page() {
  return (
    <>
      <PageShell>
        <Breadcrumbs items={[{ label: "فرآیند کار" }]} />
        <Eyebrow>فرآیند کار</Eyebrow>
        <h1 className="mt-5 max-w-3xl text-[2rem] leading-[1.35] font-bold sm:text-[2.75rem] sm:leading-[1.25]">
          پروژه از کجا شروع می‌شود و چطور جلو می‌رود؟
        </h1>
        <Lead className="max-w-3xl">
          هیچ مرحله‌ای پنهان نیست. در هر مرحله مشخص است چه چیزی تحویل داده می‌شود، چه تصمیمی گرفته
          شده و قدم بعدی چیست.
        </Lead>
      </PageShell>

      <Section className="border-t border-border">
        <Container>
          <ol className="relative">
            {stages.map((s, i) => (
              <li key={s.en} className="group relative grid gap-5 border-t border-border py-9 sm:grid-cols-[5rem_minmax(0,1fr)] sm:gap-10">
                <div className="flex items-baseline gap-3 sm:block">
                  <span dir="ltr" className="font-display text-3xl font-extrabold text-brand/25 transition-colors group-hover:text-brand sm:text-4xl">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <div>
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h2 className="text-xl font-bold sm:text-2xl">{s.fa}</h2>
                    <span dir="ltr" className="text-xs tracking-[0.14em] text-muted-foreground uppercase">
                      {s.en}
                    </span>
                  </div>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">{s.body}</p>
                  <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs text-foreground/80">
                    <span className="size-1.5 rounded-full bg-brand" aria-hidden />
                    خروجی: {s.out}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <Section className="border-t border-border bg-surface">
        <Container>
          <SectionTitle className="mt-0">مرحله اول رایگان است</SectionTitle>
          <Lead>
            شناخت اولیه و بررسی وضعیت فعلی بدون هزینه انجام می‌شود؛ بعد از آن تصمیم می‌گیرید ادامه
            بدهید یا نه.
          </Lead>
          <div className="mt-8 flex flex-wrap gap-3">
            <CtaLink to="/start-project">شروع پروژه</CtaLink>
            <CtaLink to="/technical-review" variant="outline">
              درخواست بررسی فنی
            </CtaLink>
          </div>
        </Container>
      </Section>
    </>
  );
}
