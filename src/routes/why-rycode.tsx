import { createFileRoute } from "@tanstack/react-router";

import { Breadcrumbs, PageShell } from "@/components/site/collection";
import { Container, CtaLink, Eyebrow, Lead, Section, SectionTitle } from "@/components/site/primitives";

const title = "چرا رای‌کد | مسئله قبل از ابزار";
const description =
  "تصمیم فنی خوب از فهم درست مسئله شروع می‌شود: مسئله‌محوری، توسعه به‌جای شروع دوباره، مالکیت روشن و ارتباط شفاف.";

export const Route = createFileRoute("/why-rycode")({
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
  return (
    <>
      <PageShell>
        <Breadcrumbs items={[{ label: "چرا رای‌کد" }]} />
        <Eyebrow>چرا رای‌کد</Eyebrow>
        <h1 className="mt-5 max-w-3xl text-[2rem] leading-[1.35] font-bold sm:text-[2.75rem] sm:leading-[1.25]">
          تصمیم فنی خوب از فهم درست مسئله شروع می‌شود.
        </h1>
        <Lead className="max-w-3xl">
          آنچه پروژه‌ها را شکست می‌دهد معمولاً انتخاب اشتباه فریم‌ورک نیست؛ نبود تعریف روشن از
          مسئله، مالکیت مبهم و ارتباط ضعیف است. رویکرد رای‌کد دقیقاً روی همین نقاط بنا شده است.
        </Lead>
      </PageShell>

      <Section className="border-y border-border bg-surface">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-20">
            <div>
              <Eyebrow>۰۱ — نقطه شروع</Eyebrow>
              <SectionTitle>مسئله قبل از ابزار</SectionTitle>
              <Lead>
                قبل از هر پیشنهاد فنی، مشخص می‌کنیم چه چیزی قرار است حل شود و موفقیت با چه چیزی
                اندازه گرفته می‌شود. اگر مسئله با یک تغییر کوچک حل شود، پروژه بزرگ پیشنهاد
                نمی‌دهیم.
              </Lead>
            </div>
            <div className="self-end border-s-2 border-brand ps-6 text-base leading-8 text-muted-foreground sm:text-lg">
              «چه چیزی امروز کار نمی‌کند؟» سوال اول هر جلسه است — نه «چه تکنولوژی‌ای دوست دارید؟»
            </div>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grid gap-10 border-b border-border pb-14 lg:grid-cols-2 lg:gap-16">
            <div>
              <Eyebrow>۰۲</Eyebrow>
              <SectionTitle>همیشه لازم نیست از صفر شروع کرد</SectionTitle>
              <Lead>
                بازنویسی کامل گران‌ترین تصمیم ممکن است. اول کد و ساختار فعلی بررسی می‌شود؛ در بسیاری
                از پروژه‌ها توسعه سیستم موجود سریع‌تر، کم‌ریسک‌تر و ارزان‌تر از شروع دوباره است.
              </Lead>
            </div>
            <div>
              <Eyebrow>۰۳</Eyebrow>
              <SectionTitle>توسعه و SEO در یک مسیر</SectionTitle>
              <Lead>
                ساختار آدرس‌ها، سرعت، معماری محتوا و داده‌های ساخت‌یافته از روز اول در تصمیم‌های فنی
                دیده می‌شوند؛ نه به‌عنوان مرحله‌ای که بعد از تحویل به پروژه اضافه شود.
              </Lead>
            </div>
          </div>

          <div className="grid gap-10 pt-14 lg:grid-cols-3 lg:gap-12">
            <div>
              <Eyebrow>۰۴</Eyebrow>
              <SectionTitle className="text-2xl sm:text-2xl">مالکیت روشن</SectionTitle>
              <Lead className="text-sm leading-7">
                کد، دامنه، پایگاه‌داده و دسترسی‌ها متعلق به شماست. هیچ بخشی از پروژه به‌عنوان اهرم
                نگه داشته نمی‌شود.
              </Lead>
            </div>
            <div>
              <Eyebrow>۰۵</Eyebrow>
              <SectionTitle className="text-2xl sm:text-2xl">توسعه‌پذیری</SectionTitle>
              <Lead className="text-sm leading-7">
                سیستم طوری ساخته می‌شود که مرحله بعدی — قابلیت جدید، حجم بیشتر یا تیم دیگر — بدون
                بازنویسی ممکن باشد.
              </Lead>
            </div>
            <div>
              <Eyebrow>۰۶</Eyebrow>
              <SectionTitle className="text-2xl sm:text-2xl">ارتباط روشن</SectionTitle>
              <Lead className="text-sm leading-7">
                وضعیت پروژه، مرحله بعدی و کاری که از سمت شما لازم است، همیشه در پنل مشتری قابل
                دیدن است.
              </Lead>
            </div>
          </div>
        </Container>
      </Section>

      <Section className="border-t border-border bg-surface">
        <Container>
          <SectionTitle className="mt-0">مسئله‌تان را بگویید</SectionTitle>
          <Lead>لازم نیست بدانید راه‌حل چیست؛ توصیف وضعیت فعلی کافی است.</Lead>
          <div className="mt-8 flex flex-wrap gap-3">
            <CtaLink to="/start-project">شروع پروژه</CtaLink>
            <CtaLink to="/problems" variant="outline">
              مشکلات رایج
            </CtaLink>
          </div>
        </Container>
      </Section>
    </>
  );
}
