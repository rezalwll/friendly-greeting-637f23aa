import { Container, CtaLink, Eyebrow, TextLink } from "@/components/site/primitives";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="grid-field pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(70%_60%_at_50%_0%,black,transparent)]" />
      <Container className="relative grid gap-14 py-20 sm:py-28 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div className="reveal">
          <Eyebrow>توسعه نرم‌افزار و رشد دیجیتال</Eyebrow>
          <h1 className="mt-6 text-[2.1rem] leading-[1.35] font-extrabold tracking-tight sm:text-[3.2rem] sm:leading-[1.25]">
            از ایده تا اجرا؛
            <br />
            از مشکل تا <span className="text-brand">راه‌حل</span>.
          </h1>
          <p className="mt-7 max-w-xl text-base leading-8 text-muted-foreground sm:text-[1.05rem]">
            رای‌کد شریک فنی کسب‌وکارها برای طراحی و توسعه وب‌سایت، فروشگاه اینترنتی، نرم‌افزارهای
            اختصاصی، یکپارچه‌سازی سیستم‌ها، سئو و توسعه پروژه‌های موجود است.
          </p>
          <p className="mt-4 max-w-xl text-sm leading-8 text-muted-foreground">
            چه بخواهید محصولی را از صفر بسازید، چه سیستم فعلی‌تان نیاز به توسعه یا تعمیر داشته باشد،
            از همان نقطه‌ای که هستید شروع می‌کنیم.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <CtaLink to="/start-project">شروع پروژه</CtaLink>
            <CtaLink to="/services" variant="outline">
              مشاهده خدمات
            </CtaLink>
          </div>

          <div className="mt-7">
            <TextLink to="/technical-review">پروژه‌ای دارید که به مشکل خورده؟ درخواست بررسی فنی</TextLink>
          </div>
        </div>

        <BrandGeometry />
      </Container>
    </section>
  );
}

/** Abstract composition derived from the RYCODE mark geometry. */
function BrandGeometry() {
  return (
    <div className="relative hidden aspect-square w-full lg:block" aria-hidden>
      <div className="absolute inset-0 rounded-[2px] border border-hairline" />
      <div className="absolute inset-x-10 top-10 bottom-24 border border-hairline" />
      <div className="absolute top-10 right-10 h-40 w-40 bg-brand" />
      <div className="absolute top-10 right-10 h-40 w-40 translate-x-[-56px] translate-y-[56px] border border-foreground/40 bg-background/0" />
      <div className="absolute bottom-24 left-10 h-px w-1/2 bg-foreground/30" />
      <div className="absolute bottom-16 left-10 h-px w-1/3 bg-brand" />
      <div className="absolute right-10 bottom-10 font-display text-[0.7rem] tracking-[0.4em] text-muted-foreground">
        RYCODE
      </div>
    </div>
  );
}
