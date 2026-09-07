import { createFileRoute } from "@tanstack/react-router";

import { Breadcrumbs, PageShell } from "@/components/site/collection";
import { Container, CtaLink, Eyebrow, Lead, Section, SectionTitle } from "@/components/site/primitives";

const title = "درباره رای‌کد | شریک فنی کسب‌وکارها";
const description =
  "رای‌کد یک مجموعه توسعه نرم‌افزار و خدمات دیجیتال است: ساخت، توسعه، نجات پروژه، رشد و نگهداری.";

export const Route = createFileRoute("/about")({
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

const modes = [
  {
    key: "Build",
    fa: "ساخت",
    body: "وقتی چیزی از ابتدا باید ساخته شود: سایت، فروشگاه، پنل یا نرم‌افزار اختصاصی، با ساختاری که بعداً بتوان روی آن ادامه داد.",
  },
  {
    key: "Develop",
    fa: "توسعه",
    body: "وقتی سیستمی وجود دارد و باید بزرگ‌تر، سریع‌تر یا کامل‌تر شود؛ بدون دور ریختن کاری که انجام شده است.",
  },
  {
    key: "Rescue",
    fa: "نجات پروژه",
    body: "وقتی پروژه متوقف، ناقص یا پر از خطاست. اول وضعیت واقعی مشخص می‌شود، بعد تصمیم می‌گیریم ادامه بدهیم یا بازنویسی کنیم.",
  },
  {
    key: "Grow",
    fa: "رشد",
    body: "وقتی محصول کار می‌کند ولی دیده نمی‌شود یا تبدیل نمی‌گیرد؛ سئو، ساختار محتوا و بهبود مسیر کاربر.",
  },
  {
    key: "Maintain",
    fa: "نگهداری",
    body: "وقتی سیستم باید پایدار بماند: پشتیبانی، به‌روزرسانی، پایش و توسعه مستمر در بازه‌های مشخص.",
  },
];

function Page() {
  return (
    <>
      <PageShell>
        <Breadcrumbs items={[{ label: "درباره رای‌کد" }]} />
        <Eyebrow>درباره رای‌کد</Eyebrow>
        <h1 className="mt-5 max-w-3xl text-[2rem] leading-[1.35] font-bold sm:text-[2.75rem] sm:leading-[1.25]">
          رای‌کد برای حل مسئله‌های واقعی دیجیتال ساخته شده است.
        </h1>
        <Lead className="max-w-3xl">
          RYCODE یک مجموعه توسعه نرم‌افزار و خدمات دیجیتال است که به کسب‌وکارها برای ساخت محصولات
          جدید، توسعه سیستم‌های موجود، حل مشکلات فنی و رشد از طریق وب کمک می‌کند.
        </Lead>
        <div className="mt-9 flex flex-wrap gap-3">
          <CtaLink to="/start-project">شروع پروژه</CtaLink>
          <CtaLink to="/technical-review" variant="outline">
            درخواست بررسی فنی
          </CtaLink>
        </div>
      </PageShell>

      <Section className="border-y border-border bg-surface">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-16">
            <div>
              <Eyebrow>فلسفه کاری</Eyebrow>
              <SectionTitle>تکنولوژی ابزار است، نه هدف.</SectionTitle>
            </div>
            <div className="space-y-6 text-base leading-8 text-muted-foreground">
              <p>
                هیچ ابزاری به‌تنهایی نتیجه نمی‌سازد. انتخاب فناوری بعد از فهم مسئله انجام می‌شود:
                اینکه چه کسی از سیستم استفاده می‌کند، چه چیزی امروز کار نمی‌کند و شش ماه بعد چه
                چیزی باید اضافه شود.
              </p>
              <p>
                به همین دلیل هر پروژه با شناخت شروع می‌شود، نه با پیشنهاد فنی. اگر راه ساده‌تری
                وجود داشته باشد — حتی اگر کار کمتری برای ما باشد — همان را پیشنهاد می‌دهیم.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <Eyebrow>پنج حالت همکاری</Eyebrow>
          <SectionTitle>بسته به وضعیت پروژه، نقش ما فرق می‌کند.</SectionTitle>
          <ol className="mt-12 space-y-0">
            {modes.map((m, i) => (
              <li
                key={m.key}
                className="grid gap-4 border-t border-border py-8 sm:grid-cols-[auto_minmax(0,14rem)_minmax(0,1fr)] sm:gap-8"
              >
                <span dir="ltr" className="font-display text-sm font-bold text-brand">
                  0{i + 1}
                </span>
                <div>
                  <h3 className="text-lg font-bold">{m.fa}</h3>
                  <p dir="ltr" className="mt-1 text-xs tracking-[0.14em] text-muted-foreground uppercase">
                    {m.key}
                  </p>
                </div>
                <p className="text-sm leading-7 text-muted-foreground">{m.body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <Section className="border-t border-border">
        <Container>
          <div className="rounded-lg border border-border bg-surface p-8 sm:p-12">
            <SectionTitle className="mt-0">اگر مطمئن نیستید در کدام حالت هستید</SectionTitle>
            <Lead>
              وضعیت فعلی‌تان را بنویسید؛ بررسی می‌کنیم و مسیر پیشنهادی را می‌گوییم، حتی اگر نتیجه
              این باشد که فعلاً نیازی به پروژه جدید ندارید.
            </Lead>
            <div className="mt-8 flex flex-wrap gap-3">
              <CtaLink to="/contact">تماس با رای‌کد</CtaLink>
              <CtaLink to="/process" variant="outline">
                فرآیند کار
              </CtaLink>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
