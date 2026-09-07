import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { articleListQuery, contentListQuery, publicFaqsQuery } from "@/lib/public-content";
import {
  ArrowSquare,
  Container,
  CtaLink,
  Eyebrow,
  Lead,
  MetaLabel,
  Section,
  SectionTitle,
  TextLink,
} from "@/components/site/primitives";
import { industries } from "@/lib/nav-content";
import { cn } from "@/lib/utils";

/* 2. CAPABILITY RAIL ---------------------------------------------------- */

export function CapabilityStrip() {
  const items = [
    { fa: "طراحی وب", en: "WEB" },
    { fa: "فروشگاه اینترنتی", en: "ECOMMERCE" },
    { fa: "نرم‌افزار اختصاصی", en: "SOFTWARE" },
    { fa: "یکپارچه‌سازی", en: "INTEGRATION" },
    { fa: "سئو", en: "SEO" },
    { fa: "پشتیبانی", en: "SUPPORT" },
  ];
  return (
    <div className="border-b border-border bg-surface">
      <Container className="flex flex-wrap items-baseline gap-x-12 gap-y-6 py-10">
        {items.map((item) => (
          <span key={item.en} className="flex flex-col gap-1.5">
            <span className="text-base font-bold">{item.fa}</span>
            <MetaLabel className="text-muted-foreground">{item.en}</MetaLabel>
          </span>
        ))}
      </Container>
    </div>
  );
}

/* 3. CUSTOMER PATH SELECTOR -------------------------------------------- */

const paths = [
  {
    key: "build",
    title: "می‌خواهم چیزی بسازم",
    body: "سایت، فروشگاه یا نرم‌افزاری در ذهن دارید و می‌خواهید از صفر ساخته شود. با شناخت مسئله شروع می‌کنیم و مسیر اجرا را روشن می‌کنیم.",
    cta: { label: "شروع پروژه", to: "/start-project" as const },
  },
  {
    key: "fix",
    title: "چیزی دارم که درست کار نمی‌کند",
    body: "سایت یا نرم‌افزار فعلی خطا دارد، کند است یا نیمه‌کاره رها شده. وضعیت فعلی را بررسی می‌کنیم و مسیر ادامه را می‌گوییم.",
    cta: { label: "درخواست بررسی فنی", to: "/technical-review" as const },
  },
  {
    key: "grow",
    title: "می‌خواهم بیشتر دیده شوم",
    body: "محصول یا خدمات دارید ولی ترافیک و فروش ارگانیک کافی نیست. رشد را از سئوی تکنیکال و ساختار محتوا شروع می‌کنیم.",
    cta: { label: "مشاهده خدمات سئو", to: "/services" as const },
  },
];

export function PathSelector() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <Section className="grain">
      <Container>
        <Eyebrow>مسیر شما</Eyebrow>
        <SectionTitle>امروز برای چه چیزی به رای‌کد نیاز دارید؟</SectionTitle>
        <Lead>
          لازم نیست اسم راه‌حل فنی را بدانید. از چیزی که می‌خواهید بسازید یا مشکلی که دارید شروع
          کنید.
        </Lead>
      </Container>

      <div className="mt-16 border-t border-border">
        {paths.map((p, i) => (
          <Link
            key={p.key}
            to={p.cta.to}
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive(null)}
            onFocus={() => setActive(i)}
            onBlur={() => setActive(null)}
            className={cn(
              "group block border-b border-border transition-colors duration-300",
              active === i ? "bg-surface" : "bg-transparent",
            )}
          >
            <Container className="flex flex-col gap-5 py-10 sm:py-14 lg:flex-row lg:items-center lg:gap-12">
              <MetaLabel index={i + 1} className="text-muted-foreground lg:w-20" />
              <h3 className="display-3 flex-1">{p.title}</h3>
              <p
                className={cn(
                  "max-w-md text-sm leading-8 text-muted-foreground transition-opacity duration-300 lg:opacity-0",
                  active === i && "lg:opacity-100",
                )}
              >
                {p.body}
              </p>
              <ArrowSquare active={active === i} />
            </Container>
          </Link>
        ))}
      </div>
    </Section>
  );
}

/* 4. SERVICES INDEX ----------------------------------------------------- */

const pillars = [
  {
    title: "طراحی و توسعه وب",
    body: "سایت شرکتی، فروشگاه اینترنتی و وب‌اپلیکیشن اختصاصی با ساختار فنی و سئوی درست از روز اول.",
  },
  {
    title: "نرم‌افزار اختصاصی",
    body: "وقتی نرم‌افزار آماده جواب نمی‌دهد: پنل، سامانه و ابزار داخلی متناسب با فرآیند واقعی شما.",
  },
  {
    title: "نجات و توسعه پروژه",
    body: "ادامه دادن پروژه‌ای که متوقف شده، بدون شروع دوباره از صفر.",
  },
  {
    title: "API و یکپارچه‌سازی",
    body: "اتصال سیستم‌ها، انبار، حسابداری و سرویس‌های داخلی به یکدیگر.",
  },
  { title: "سئو و رشد", body: "سئوی تکنیکال، ساختار محتوا و بهبود Core Web Vitals." },
  {
    title: "داده و ابزارهای کسب‌وکار",
    body: "داشبورد، گزارش‌گیری و ابزارهایی که تصمیم‌گیری را ساده می‌کنند.",
  },
  {
    title: "پشتیبانی و توسعه مستمر",
    body: "رابطه‌ای که بعد از تحویل ادامه دارد: نگهداری، بهبود و توسعه تدریجی.",
  },
];

export function ServicesEditorial() {
  return (
    <Section className="bg-surface">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.6fr] lg:items-start">
          <div className="lg:sticky lg:top-28">
            <MetaLabel className="text-muted-foreground">SERVICES / 07</MetaLabel>
            <h2 className="display-2 mt-6">خدمات رای‌کد</h2>
            <p className="mt-6 max-w-sm text-base leading-8 text-muted-foreground">
              هفت حوزه کاری که می‌توانند جدا یا کنار هم اجرا شوند.
            </p>
            <div className="mt-8">
              <TextLink to="/services">همه خدمات</TextLink>
            </div>
          </div>

          <ul className="border-t border-border">
            {pillars.map((p, i) => (
              <li key={p.title}>
                <Link
                  to="/services"
                  className="group flex items-center gap-6 border-b border-border py-8 transition-colors hover:bg-background"
                >
                  <MetaLabel index={i + 1} className="text-muted-foreground" />
                  <span className="flex-1">
                    <span className="block text-xl font-bold sm:text-2xl">{p.title}</span>
                    <span className="mt-2 block max-w-lg text-sm leading-7 text-muted-foreground">
                      {p.body}
                    </span>
                  </span>
                  <ArrowSquare />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </Section>
  );
}

/* 5. WHAT WE BUILD (dark) ----------------------------------------------- */

const systems = [
  { name: "فروشگاه اینترنتی", body: "فروش آنلاین با مدیریت محصول، سفارش و پرداخت متناسب کسب‌وکار." },
  { name: "CRM", body: "مدیریت سرنخ، مشتری و پیگیری فروش در یک جای واحد." },
  { name: "سامانه سفارش‌گیری", body: "ثبت و پیگیری سفارش برای تیم فروش، نمایندگان یا مشتریان." },
  { name: "پنل مشتری", body: "دسترسی مشتری به سفارش‌ها، صورتحساب‌ها و درخواست‌ها." },
  { name: "Dashboard", body: "نمای واحد از داده‌های عملیاتی و شاخص‌های کسب‌وکار." },
  { name: "نوبت‌دهی", body: "زمان‌بندی مراجعه و مدیریت ظرفیت برای کلینیک و خدمات." },
  { name: "رزرو", body: "رزرو آنلاین منابع، خدمات یا فضا با قوانین اختصاصی." },
  { name: "Marketplace", body: "پلتفرم چندفروشندگی با مدیریت فروشنده و تسویه." },
  { name: "سامانه گارانتی", body: "ثبت محصول، پیگیری گارانتی و درخواست خدمات." },
  { name: "پنل نمایندگان", body: "قیمت‌گذاری، سفارش و گزارش اختصاصی برای شبکه فروش." },
  { name: "LMS", body: "دوره، آزمون و مسیر یادگیری برای آموزش آنلاین." },
];

export function SolutionExplorer() {
  const [active, setActive] = useState(0);
  const current = systems[active]!;

  return (
    <section className="bg-ink py-24 text-ink-foreground sm:py-32">
      <Container>
        <MetaLabel className="text-brand">SOLUTIONS</MetaLabel>
        <h2 className="display-2 mt-6 max-w-3xl">چه چیزی می‌توانیم برای شما بسازیم؟</h2>

        <div className="mt-14 grid gap-0 border-t border-white/12 lg:grid-cols-[1fr_1fr]">
          <ul className="lg:border-e lg:border-white/12 lg:pe-10">
            {systems.map((s, i) => (
              <li key={s.name}>
                <button
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  aria-pressed={active === i}
                  className={cn(
                    "flex w-full items-center gap-5 border-b border-white/10 py-5 text-start transition-colors duration-200",
                    active === i ? "text-brand" : "text-ink-foreground/70 hover:text-ink-foreground",
                  )}
                >
                  <MetaLabel index={i + 1} className="opacity-60" />
                  <span className="text-lg font-bold sm:text-xl">{s.name}</span>
                </button>
              </li>
            ))}
          </ul>

          <div className="border-b border-white/12 px-0 py-12 lg:ps-14">
            <div className="lg:sticky lg:top-28">
              <div className="relative aspect-[4/3] w-full border border-white/12">
                <div className="grid-field absolute inset-0 opacity-20" />
                <div className="absolute top-8 right-8 h-16 w-16 bg-brand" />
                <div className="absolute top-8 right-8 h-16 w-16 translate-x-[-28px] translate-y-[28px] border border-white/40" />
                <div className="absolute bottom-8 left-8 h-px w-1/2 bg-white/25" />
                <MetaLabel className="absolute bottom-6 left-8 text-white/40">
                  PREVIEW / {String(active + 1).padStart(2, "0")}
                </MetaLabel>
              </div>
              <h3 className="mt-8 text-2xl font-bold">{current.name}</h3>
              <p className="mt-4 text-base leading-8 text-ink-foreground/70">{current.body}</p>
              <div className="mt-8">
                <TextLink to="/solutions" className="text-ink-foreground">
                  جزئیات راهکارها
                </TextLink>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* 6. PROJECT RESCUE (orange interruption) -------------------------------- */

export function ProjectRescue() {
  const steps = ["بررسی", "تصمیم", "ادامه"];
  return (
    <section className="bg-brand py-24 text-brand-foreground sm:py-32">
      <Container>
        <MetaLabel>PROJECT RESCUE</MetaLabel>
        <h2 className="display-1 mt-8 max-w-[14ch]">
          پروژه‌ای دارید که جایی در مسیر متوقف شده؟
        </h2>

        <div className="mt-16 grid gap-10 border-t border-brand-foreground/25 pt-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <ol className="grid gap-0 sm:grid-cols-3">
            {steps.map((step, i) => (
              <li key={step} className="border-t border-brand-foreground/25 py-6 sm:border-t-0">
                <MetaLabel index={i + 1}>{step}</MetaLabel>
                <p className="mt-3 text-2xl font-bold">{step}</p>
              </li>
            ))}
          </ol>
          <div className="lg:text-end">
            <p className="max-w-md text-base leading-8 lg:ms-auto">
              اگر برنامه‌نویس قبلی پروژه را رها کرده یا سیستم فعلی برای رشد کافی نیست، لازم نیست
              دوباره از صفر شروع کنید.
            </p>
            <div className="mt-8 inline-flex">
              <CtaLink
                to="/technical-review"
                className="bg-brand-foreground text-brand hover:bg-brand-foreground/90"
              >
                ارسال پروژه برای بررسی
              </CtaLink>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* 7. SELECTED PROJECTS -------------------------------------------------- */

const projects = [
  {
    name: "سامانه سفارش‌گیری نمایندگان",
    industry: "تولید و کارخانه",
    problem: "ثبت سفارش نمایندگان به‌صورت تلفنی و اکسل انجام می‌شد و پیگیری آن دشوار بود.",
    solution: "پنل اختصاصی نمایندگان با قیمت‌گذاری پلکانی، ثبت سفارش و گزارش وضعیت.",
  },
  {
    name: "بازطراحی فروشگاه اینترنتی",
    industry: "خودرو و لوازم یدکی",
    problem: "ساختار دسته‌بندی و سرعت سایت مانع رشد ترافیک ارگانیک بود.",
    solution: "بازسازی معماری اطلاعات، بهبود Core Web Vitals و سئوی فروشگاهی.",
  },
  {
    name: "پرتال خدمات پس از فروش",
    industry: "تجهیزات صنعتی",
    problem: "درخواست‌های گارانتی و پشتیبانی در کانال‌های پراکنده گم می‌شد.",
    solution: "سامانه ثبت محصول، گارانتی و تیکتینگ با داشبورد داخلی.",
  },
];

function CaseVisual({ index }: { index: number }) {
  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden border border-border bg-surface-2">
      <div className="grid-field absolute inset-0 opacity-60" />
      <div className="absolute top-10 right-10 h-28 w-28 bg-brand transition-transform duration-500 group-hover:scale-105" />
      <div className="absolute top-10 right-10 h-28 w-28 translate-x-[-44px] translate-y-[44px] border border-foreground/30" />
      <span
        dir="ltr"
        className="absolute bottom-4 left-6 text-[5rem] leading-none font-extrabold text-foreground/8"
      >
        {String(index).padStart(2, "0")}
      </span>
    </div>
  );
}

export function SelectedProjects() {
  const { data } = useQuery(contentListQuery("case_study", { page: 1, q: "" }));
  const published = (data?.rows ?? []).slice(0, 3);

  return (
    <Section className="grain">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <MetaLabel className="text-muted-foreground">SELECTED WORK</MetaLabel>
            <h2 className="display-2 mt-6 max-w-3xl">
              پروژه فقط چیزی نیست که ساختیم؛ مسئله‌ای است که حل کردیم.
            </h2>
          </div>
          <TextLink to="/projects">همه پروژه‌ها</TextLink>
        </div>

        <div className="mt-16 border-t border-border">
          {published.length > 0
            ? published.map((p, i) => (
                <Link
                  key={p.id}
                  to="/projects/$slug"
                  params={{ slug: p.slug }}
                  className="group grid gap-8 border-b border-border py-14 lg:grid-cols-[1.4fr_1fr] lg:items-center lg:gap-16 lg:even:[direction:inherit]"
                >
                  <div className={cn(i % 2 === 1 && "lg:order-2")}>
                    <CaseVisual index={i + 1} />
                  </div>
                  <div>
                    <MetaLabel index={i + 1} className="text-muted-foreground">
                      CASE STUDY
                    </MetaLabel>
                    <h3 className="display-3 mt-5">{p.title_fa}</h3>
                    {p.summary_fa && (
                      <p className="mt-5 max-w-lg text-base leading-8 text-muted-foreground">
                        {p.summary_fa}
                      </p>
                    )}
                    <span className="mt-8 inline-flex items-center gap-3 text-sm font-bold">
                      مطالعه موردی
                      <ArrowSquare />
                    </span>
                  </div>
                </Link>
              ))
            : projects.map((p, i) => (
                <article
                  key={p.name}
                  className="group grid gap-8 border-b border-border py-14 lg:grid-cols-[1.4fr_1fr] lg:items-center lg:gap-16"
                >
                  <div className={cn(i % 2 === 1 && "lg:order-2")}>
                    <CaseVisual index={i + 1} />
                  </div>
                  <div>
                    <MetaLabel index={i + 1} className="text-muted-foreground">
                      {p.industry}
                    </MetaLabel>
                    <h3 className="display-3 mt-5">{p.name}</h3>
                    <dl className="mt-6 space-y-5 text-sm">
                      <div>
                        <dt className="meta-label text-brand">PROBLEM</dt>
                        <dd className="mt-2 max-w-lg leading-8 text-muted-foreground">
                          {p.problem}
                        </dd>
                      </div>
                      <div>
                        <dt className="meta-label text-brand">SOLUTION</dt>
                        <dd className="mt-2 max-w-lg leading-8 text-muted-foreground">
                          {p.solution}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </article>
              ))}
        </div>

        {published.length === 0 && (
          <p className="mt-6 text-xs text-muted-foreground">
            نمونه‌های بالا پروژه‌های مفهومی برای نمایش نوع مسئله و راه‌حل هستند و شامل نام مشتری یا
            آمار واقعی نیستند.
          </p>
        )}
      </Container>
    </Section>
  );
}

/* 8. INDUSTRIES MATRIX --------------------------------------------------- */

const capabilityColumns = ["WEB", "SOFTWARE", "SEO", "DATA"] as const;

function capabilitiesFor(index: number): boolean[] {
  // Deterministic, presentational coverage map derived from list order.
  const patterns = [
    [true, true, true, false],
    [true, true, true, true],
    [true, false, true, false],
    [true, true, false, true],
  ];
  return patterns[index % patterns.length]!;
}

export function IndustriesSection() {
  return (
    <section className="bg-ink py-24 text-ink-foreground sm:py-32">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <MetaLabel className="text-brand">INDUSTRIES</MetaLabel>
            <h2 className="display-2 mt-6 max-w-2xl">
              تکنولوژی باید با مدل کسب‌وکار هماهنگ باشد.
            </h2>
          </div>
          <TextLink to="/industries" className="text-ink-foreground">
            همه صنایع
          </TextLink>
        </div>

        <div className="mt-14 hidden border-t border-white/12 lg:block">
          <div className="grid grid-cols-[1.6fr_repeat(4,minmax(0,1fr))] border-b border-white/12 py-4">
            <span />
            {capabilityColumns.map((c) => (
              <MetaLabel key={c} className="text-white/45">
                {c}
              </MetaLabel>
            ))}
          </div>
          {industries.map((name, i) => (
            <Link
              key={name}
              to="/industries"
              className="grid grid-cols-[1.6fr_repeat(4,minmax(0,1fr))] items-center border-b border-white/10 py-5 transition-colors hover:bg-white/5"
            >
              <span className="text-base font-semibold">{name}</span>
              {capabilitiesFor(i).map((on, j) => (
                <span key={capabilityColumns[j]} className="text-sm">
                  {on ? (
                    <span className="inline-block size-2 rounded-full bg-brand" />
                  ) : (
                    <span className="inline-block size-2 rounded-full bg-white/15" />
                  )}
                </span>
              ))}
            </Link>
          ))}
        </div>

        <ul className="mt-12 border-t border-white/12 lg:hidden">
          {industries.map((name, i) => (
            <li key={name}>
              <Link
                to="/industries"
                className="flex items-center justify-between gap-4 border-b border-white/10 py-5"
              >
                <span className="text-base font-semibold">{name}</span>
                <span className="flex items-center gap-1.5">
                  {capabilitiesFor(i).map((on, j) => (
                    <span
                      key={capabilityColumns[j]}
                      className={cn(
                        "inline-block size-1.5 rounded-full",
                        on ? "bg-brand" : "bg-white/15",
                      )}
                    />
                  ))}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

/* 9. WHY RYCODE ---------------------------------------------------------- */

const whyItems = [
  {
    title: "مسئله قبل از ابزار.",
    body: "اول مسئله کسب‌وکار را می‌فهمیم، بعد درباره تکنولوژی تصمیم می‌گیریم.",
  },
  {
    title: "همیشه لازم نیست از صفر شروع کنید.",
    body: "اگر پروژه فعلی قابل نجات باشد، همان را توسعه می‌دهیم.",
  },
  {
    title: "توسعه و سئو در یک مسیر.",
    body: "ساختار فنی و دیده‌شدن در جستجو از ابتدا کنار هم دیده می‌شوند.",
  },
  { title: "مالکیت روشن.", body: "کد، دسترسی‌ها و داده‌ها متعلق به شماست." },
  {
    title: "رابطه بعد از تحویل.",
    body: "تحویل پایان کار نیست؛ نقطه شروع نگهداری و توسعه است.",
  },
];

export function WhyRycode() {
  return (
    <Section className="grain bg-surface">
      <Container>
        <MetaLabel className="text-muted-foreground">WHY RYCODE</MetaLabel>
        <div className="mt-14 border-t border-border">
          {whyItems.map((item, i) => (
            <div
              key={item.title}
              className={cn(
                "grid gap-6 border-b border-border py-14 lg:grid-cols-2 lg:items-start lg:gap-16",
              )}
            >
              <div className={cn(i % 2 === 1 && "lg:order-2")}>
                <MetaLabel index={i + 1} className="text-brand" />
                <h3 className="display-3 mt-5 max-w-[16ch]">{item.title}</h3>
              </div>
              <p className="max-w-md text-base leading-9 text-muted-foreground lg:pt-14">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}

/* 10. PROCESS ------------------------------------------------------------ */

const stages = [
  { fa: "شناخت", en: "DISCOVER" },
  { fa: "تعریف", en: "DEFINE" },
  { fa: "طراحی", en: "DESIGN" },
  { fa: "توسعه", en: "BUILD" },
  { fa: "تست", en: "TEST" },
  { fa: "انتشار", en: "LAUNCH" },
  { fa: "بهبود", en: "IMPROVE" },
];

export function ProcessSection() {
  return (
    <Section>
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <MetaLabel className="text-muted-foreground">PROCESS</MetaLabel>
            <h2 className="display-2 mt-6">مسیری که هر پروژه طی می‌کند.</h2>
          </div>
          <TextLink to="/process">جزئیات فرآیند</TextLink>
        </div>

        <ol className="mt-16 border-t border-border">
          {stages.map((stage, i) => (
            <li
              key={stage.en}
              className="flex items-baseline gap-6 border-b border-border py-7 sm:gap-12"
            >
              <span dir="ltr" className="text-3xl font-extrabold text-foreground/15 sm:text-5xl">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="flex-1 text-xl font-bold sm:text-2xl">{stage.fa}</span>
              <MetaLabel className="text-muted-foreground">{stage.en}</MetaLabel>
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  );
}

/* 11. PAYMENT ------------------------------------------------------------ */

export function PaymentSection() {
  return (
    <Section className="bg-brand-soft">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:items-end">
          <h2 className="display-2 max-w-[14ch]">
            پرداخت پروژه می‌تواند با مراحل اجرا هماهنگ باشد.
          </h2>
          <div className="text-base leading-9 text-muted-foreground">
            <p>
              در پروژه‌های واجد شرایط، هزینه به مراحل مشخص اجرا تقسیم می‌شود؛ هر مرحله پس از تحویل و
              تایید خروجی همان مرحله تسویه می‌شود.
            </p>
            <div className="mt-8">
              <TextLink to="/start-project">بررسی شرایط پرداخت مرحله‌ای</TextLink>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}

/* 12. BLOG --------------------------------------------------------------- */

export function BlogSection() {
  const { data } = useQuery(articleListQuery({ page: 1, q: "" }));
  const rows = data?.rows ?? [];
  const featured = rows[0] ?? null;
  const latest = rows.slice(1, 6);

  return (
    <Section>
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <MetaLabel className="text-muted-foreground">JOURNAL</MetaLabel>
            <h2 className="display-2 mt-6 max-w-3xl">
              درباره ساخت، رشد و نگهداری محصولات دیجیتال می‌نویسیم.
            </h2>
          </div>
          <TextLink to="/blog">همه مقاله‌ها</TextLink>
        </div>

        {featured ? (
          <Link
            to="/blog/$slug"
            params={{ slug: featured.slug }}
            className="group mt-14 grid gap-10 border-y border-border py-12 lg:grid-cols-[1fr_1fr] lg:items-center"
          >
            <div className="relative aspect-[16/9] overflow-hidden border border-border bg-surface-2">
              <div className="grid-field absolute inset-0 opacity-50" />
              <div className="absolute bottom-0 left-0 h-1.5 w-1/3 bg-brand" />
            </div>
            <div>
              <MetaLabel className="text-brand">FEATURED</MetaLabel>
              <h3 className="display-3 mt-5">{featured.title_fa}</h3>
              {featured.excerpt_fa && (
                <p className="mt-5 line-clamp-3 max-w-lg text-base leading-8 text-muted-foreground">
                  {featured.excerpt_fa}
                </p>
              )}
              <span className="mt-8 inline-flex items-center gap-3 text-sm font-bold">
                خواندن مقاله
                <ArrowSquare />
              </span>
            </div>
          </Link>
        ) : (
          <div className="mt-14 border-y border-dashed border-border py-16">
            <MetaLabel className="text-muted-foreground">FEATURED</MetaLabel>
            <p className="mt-5 max-w-xl text-base leading-8 text-muted-foreground">
              هنوز مقاله‌ای منتشر نشده است. پس از انتشار، مقاله شاخص در این بخش نمایش داده می‌شود.
            </p>
          </div>
        )}

        {latest.length > 0 && (
          <ul>
            {latest.map((a, i) => (
              <li key={a.id}>
                <Link
                  to="/blog/$slug"
                  params={{ slug: a.slug }}
                  className="group flex items-center gap-6 border-b border-border py-7 transition-colors hover:text-brand"
                >
                  <MetaLabel index={i + 2} className="text-muted-foreground" />
                  <span className="flex-1 text-lg font-bold leading-8">{a.title_fa}</span>
                  <ArrowSquare />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Container>
    </Section>
  );
}

/* 13. FAQ ---------------------------------------------------------------- */

const faqs = [
  {
    q: "پروژه نیمه‌کاره من را هم قبول می‌کنید؟",
    a: "بله. ابتدا وضعیت فعلی کد، دسترسی‌ها و زیرساخت بررسی می‌شود و بعد مشخص می‌کنیم ادامه دادن مسیر فعلی به‌صرفه است یا بازسازی بخشی از آن.",
  },
  {
    q: "هزینه پروژه چطور مشخص می‌شود؟",
    a: "بعد از جلسه شناخت و مشخص شدن دامنه کار، برآورد زمان و هزینه ارائه می‌شود. پروژه‌های بزرگ‌تر می‌توانند مرحله‌ای اجرا و تسویه شوند.",
  },
  {
    q: "مالکیت کد با چه کسی است؟",
    a: "کد، دسترسی‌ها، دیتابیس و دامنه متعلق به کارفرماست و در پایان پروژه به‌صورت کامل تحویل داده می‌شود.",
  },
  {
    q: "بعد از تحویل پشتیبانی وجود دارد؟",
    a: "بله. نگهداری، رفع مشکل و توسعه مستمر به‌صورت قرارداد جداگانه یا درخواست موردی ادامه پیدا می‌کند.",
  },
];

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);
  const { data } = useQuery(publicFaqsQuery());
  const published = (data ?? []).slice(0, 8);
  const items =
    published.length > 0 ? published.map((f) => ({ q: f.question_fa, a: f.answer_fa })) : faqs;

  return (
    <Section className="bg-surface">
      <Container>
        <MetaLabel className="text-muted-foreground">FAQ</MetaLabel>
        <h2 className="display-2 mt-6">پرسش‌های پرتکرار</h2>

        <div className="mt-14 border-t border-border">
          {items.map((f, i) => (
            <div key={f.q} className="border-b border-border">
              <button
                type="button"
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between gap-8 py-8 text-start"
                aria-expanded={open === i}
              >
                <span
                  className={cn(
                    "text-xl font-bold sm:text-2xl",
                    open === i ? "text-brand" : "text-foreground",
                  )}
                >
                  {f.q}
                </span>
                <span
                  aria-hidden
                  className={cn(
                    "grid size-9 shrink-0 place-items-center rounded-[5px] border text-lg transition-colors",
                    open === i ? "border-brand bg-brand text-brand-foreground" : "border-border",
                  )}
                >
                  {open === i ? "−" : "+"}
                </span>
              </button>
              {open === i && (
                <p className="max-w-3xl pb-8 text-base leading-9 text-muted-foreground">{f.a}</p>
              )}
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}

/* 14. FINAL CTA ---------------------------------------------------------- */

export function FinalCta() {
  return (
    <section className="bg-ink py-28 text-ink-foreground sm:py-40">
      <Container>
        <MetaLabel className="text-brand">START HERE</MetaLabel>
        <h2 className="display-1 mt-8 max-w-[15ch]">
          پروژه‌ای در ذهن دارید؟
          <br />
          یا <span className="text-brand">مشکلی</span> که باید حل شود؟
        </h2>
        <div className="mt-14 flex flex-wrap items-center gap-8 border-t border-white/12 pt-10">
          <CtaLink to="/start-project">شروع پروژه</CtaLink>
          <TextLink to="/technical-review" className="text-ink-foreground">
            درخواست بررسی فنی
          </TextLink>
        </div>
      </Container>
    </section>
  );
}
