import { useState } from "react";
import { ArrowLeft, Check } from "lucide-react";
import {
  Container,
  CtaLink,
  Eyebrow,
  Lead,
  Section,
  SectionTitle,
  TextLink,
} from "@/components/site/primitives";
import { industries } from "@/lib/nav-content";
import { cn } from "@/lib/utils";

/* 2. CAPABILITY STRIP -------------------------------------------------- */

export function CapabilityStrip() {
  const items = [
    "طراحی وب",
    "فروشگاه اینترنتی",
    "نرم‌افزار اختصاصی",
    "یکپارچه‌سازی",
    "سئو",
    "پشتیبانی",
  ];
  return (
    <div className="hairline-y bg-surface">
      <Container className="flex flex-wrap items-center gap-x-10 gap-y-4 py-6">
        {items.map((item, i) => (
          <span key={item} className="flex items-center gap-3 text-sm font-semibold">
            <span className="font-display text-[0.7rem] text-brand" dir="ltr">
              0{i + 1}
            </span>
            {item}
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
  const [active, setActive] = useState(0);
  const current = paths[active]!;

  return (
    <Section>
      <Container>
        <Eyebrow>مسیر شما</Eyebrow>
        <SectionTitle>امروز برای چه چیزی به رای‌کد نیاز دارید؟</SectionTitle>
        <Lead>
          لازم نیست اسم راه‌حل فنی را بدانید. از چیزی که می‌خواهید بسازید یا مشکلی که دارید شروع
          کنید.
        </Lead>

        <div className="mt-12 grid gap-0 border-t border-border lg:grid-cols-[1fr_1.1fr]">
          <ul>
            {paths.map((p, i) => (
              <li key={p.key}>
                <button
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  className={cn(
                    "group flex w-full items-center justify-between border-b border-border py-7 text-start transition-colors",
                    active === i ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  <span className="flex items-baseline gap-4">
                    <span
                      className={cn(
                        "font-display text-xs",
                        active === i ? "text-brand" : "text-muted-foreground",
                      )}
                      dir="ltr"
                    >
                      0{i + 1}
                    </span>
                    <span className="text-lg font-bold sm:text-xl">{p.title}</span>
                  </span>
                  <ArrowLeft
                    className={cn(
                      "size-5 transition-all",
                      active === i ? "text-brand opacity-100" : "opacity-0",
                    )}
                  />
                </button>
              </li>
            ))}
          </ul>

          <div className="border-b border-border bg-surface p-8 lg:border-s lg:p-12">
            <p className="text-base leading-8">{current.body}</p>
            <div className="mt-8">
              <CtaLink to={current.cta.to}>{current.cta.label}</CtaLink>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}

/* 4. SERVICES ----------------------------------------------------------- */

const pillars = [
  {
    title: "طراحی و توسعه وب",
    body: "سایت شرکتی، فروشگاه اینترنتی و وب‌اپلیکیشن اختصاصی با ساختار فنی و سئوی درست از روز اول.",
    span: "lg:col-span-7",
  },
  {
    title: "نرم‌افزار اختصاصی",
    body: "وقتی نرم‌افزار آماده جواب نمی‌دهد: پنل، سامانه و ابزار داخلی متناسب با فرآیند واقعی شما.",
    span: "lg:col-span-5",
  },
  {
    title: "نجات و توسعه پروژه",
    body: "ادامه دادن پروژه‌ای که متوقف شده، بدون شروع دوباره از صفر.",
    span: "lg:col-span-5",
  },
  {
    title: "API و یکپارچه‌سازی",
    body: "اتصال سیستم‌ها، انبار، حسابداری و سرویس‌های داخلی به یکدیگر.",
    span: "lg:col-span-4",
  },
  {
    title: "سئو و رشد",
    body: "سئوی تکنیکال، ساختار محتوا و بهبود Core Web Vitals.",
    span: "lg:col-span-3",
  },
  {
    title: "داده و ابزارهای کسب‌وکار",
    body: "داشبورد، گزارش‌گیری و ابزارهایی که تصمیم‌گیری را ساده می‌کنند.",
    span: "lg:col-span-6",
  },
  {
    title: "پشتیبانی و توسعه مستمر",
    body: "رابطه‌ای که بعد از تحویل ادامه دارد: نگهداری، بهبود و توسعه تدریجی.",
    span: "lg:col-span-6",
  },
];

export function ServicesEditorial() {
  return (
    <Section className="bg-surface">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Eyebrow>خدمات</Eyebrow>
            <SectionTitle>یک تیم برای ساخت، توسعه و رشد.</SectionTitle>
          </div>
          <TextLink to="/services">همه خدمات</TextLink>
        </div>

        <div className="mt-14 grid gap-px border border-border bg-border lg:grid-cols-12">
          {pillars.map((p, i) => (
            <article key={p.title} className={cn("bg-surface p-8 sm:p-10", p.span)}>
              <span className="font-display text-xs text-brand" dir="ltr">
                0{i + 1}
              </span>
              <h3 className="mt-4 text-xl font-bold">{p.title}</h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{p.body}</p>
            </article>
          ))}
        </div>
      </Container>
    </Section>
  );
}

/* 5. WHAT WE BUILD ------------------------------------------------------ */

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
    <Section>
      <Container>
        <Eyebrow>راهکارها</Eyebrow>
        <SectionTitle>چه چیزی می‌توانیم برای کسب‌وکار شما بسازیم؟</SectionTitle>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div className="flex flex-wrap gap-2">
            {systems.map((s, i) => (
              <button
                key={s.name}
                type="button"
                onClick={() => setActive(i)}
                onMouseEnter={() => setActive(i)}
                className={cn(
                  "rounded-md border px-4 py-2.5 text-sm font-semibold transition-colors",
                  active === i
                    ? "border-brand bg-brand text-brand-foreground"
                    : "border-border text-foreground/80 hover:border-foreground/30",
                )}
              >
                {s.name}
              </button>
            ))}
          </div>

          <div className="border-s-2 border-brand ps-8">
            <h3 className="text-2xl font-bold">{current.name}</h3>
            <p className="mt-4 text-sm leading-8 text-muted-foreground">{current.body}</p>
            <div className="mt-8">
              <TextLink to="/solutions">جزئیات راهکارها</TextLink>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}

/* 6. PROJECT RESCUE ----------------------------------------------------- */

export function ProjectRescue() {
  const steps = ["بررسی وضعیت فعلی", "مشخص کردن مسیر ادامه", "توسعه و تحویل"];
  return (
    <section className="bg-ink py-24 text-ink-foreground sm:py-32">
      <Container>
        <div className="grid gap-14 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div>
            <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.14em] text-brand uppercase">
              <span className="inline-block h-px w-6 bg-brand" />
              نجات پروژه
            </p>
            <h2 className="mt-6 text-[1.8rem] leading-[1.35] font-bold sm:text-4xl sm:leading-[1.3]">
              پروژه‌ای دارید که جایی در مسیر متوقف شده؟
            </h2>
            <p className="mt-6 max-w-xl text-sm leading-8 text-ink-foreground/70">
              اگر برنامه‌نویس قبلی پروژه را رها کرده، سایت یا نرم‌افزار با خطا روبه‌رو شده، سرعت
              پایین آمده یا سیستم برای ادامه رشد نیاز به توسعه دارد، لازم نیست همیشه دوباره از صفر
              شروع کنید.
            </p>
            <div className="mt-9">
              <CtaLink to="/technical-review">ارسال پروژه برای بررسی</CtaLink>
            </div>
          </div>

          <ol className="relative space-y-0">
            {steps.map((step, i) => (
              <li
                key={step}
                className="flex items-center gap-6 border-t border-white/10 py-8 last:border-b"
              >
                <span className="font-display text-3xl text-brand" dir="ltr">
                  0{i + 1}
                </span>
                <span className="text-lg font-semibold">{step}</span>
              </li>
            ))}
          </ol>
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
    services: ["نرم‌افزار اختصاصی", "یکپارچه‌سازی"],
  },
  {
    name: "بازطراحی فروشگاه اینترنتی",
    industry: "خودرو و لوازم یدکی",
    problem: "ساختار دسته‌بندی و سرعت سایت مانع رشد ترافیک ارگانیک بود.",
    solution: "بازسازی معماری اطلاعات، بهبود Core Web Vitals و سئوی فروشگاهی.",
    services: ["فروشگاه اینترنتی", "سئو تکنیکال"],
  },
  {
    name: "پرتال خدمات پس از فروش",
    industry: "تجهیزات صنعتی",
    problem: "درخواست‌های گارانتی و پشتیبانی در کانال‌های پراکنده گم می‌شد.",
    solution: "سامانه ثبت محصول، گارانتی و تیکتینگ با داشبورد داخلی.",
    services: ["سامانه گارانتی", "تیکتینگ"],
  },
];

export function SelectedProjects() {
  return (
    <Section className="bg-surface">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Eyebrow>پروژه‌ها</Eyebrow>
            <SectionTitle>
              پروژه فقط چیزی نیست که ساختیم؛ مسئله‌ای است که حل کردیم.
            </SectionTitle>
          </div>
          <TextLink to="/projects">همه پروژه‌ها</TextLink>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {projects.map((p) => (
            <article key={p.name} className="flex flex-col border border-border bg-background p-8">
              <span className="w-fit border border-brand px-2 py-1 text-[0.65rem] font-bold text-brand">
                پروژه مفهومی
              </span>
              <h3 className="mt-5 text-lg font-bold">{p.name}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{p.industry}</p>
              <dl className="mt-6 space-y-4 text-sm">
                <div>
                  <dt className="text-xs font-bold text-brand">مسئله</dt>
                  <dd className="mt-1 leading-7 text-muted-foreground">{p.problem}</dd>
                </div>
                <div>
                  <dt className="text-xs font-bold text-brand">راه‌حل</dt>
                  <dd className="mt-1 leading-7 text-muted-foreground">{p.solution}</dd>
                </div>
              </dl>
              <div className="mt-auto flex flex-wrap gap-2 pt-6">
                {p.services.map((s) => (
                  <span key={s} className="bg-secondary px-2.5 py-1 text-xs text-muted-foreground">
                    {s}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
        <p className="mt-6 text-xs text-muted-foreground">
          نمونه‌های بالا پروژه‌های مفهومی برای نمایش نوع مسئله و راه‌حل هستند و شامل نام مشتری یا
          آمار واقعی نیستند.
        </p>
      </Container>
    </Section>
  );
}

/* 8. INDUSTRIES --------------------------------------------------------- */

export function IndustriesSection() {
  return (
    <Section>
      <Container>
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <Eyebrow>صنایع</Eyebrow>
            <SectionTitle>تکنولوژی باید با مدل کسب‌وکار هماهنگ باشد.</SectionTitle>
            <Lead>
              مدل فروش، زنجیره تامین و مشتری در هر صنعت متفاوت است؛ راهکار فنی هم باید متفاوت باشد.
            </Lead>
            <div className="mt-8">
              <TextLink to="/industries">مشاهده همه صنایع</TextLink>
            </div>
          </div>

          <ul className="border-t border-border">
            {industries.map((name) => (
              <li key={name}>
                <a
                  href="/industries"
                  className="group flex items-center justify-between border-b border-border py-5 text-base font-semibold transition-colors hover:text-brand"
                >
                  {name}
                  <ArrowLeft className="size-4 opacity-0 transition-opacity group-hover:opacity-100" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </Section>
  );
}

/* 9. WHY RYCODE --------------------------------------------------------- */

const whyItems = [
  {
    title: "مسئله قبل از ابزار",
    body: "اول مسئله کسب‌وکار را می‌فهمیم، بعد درباره تکنولوژی تصمیم می‌گیریم.",
  },
  {
    title: "همیشه لازم نیست از صفر شروع کنید",
    body: "اگر پروژه فعلی قابل نجات باشد، همان را توسعه می‌دهیم.",
  },
  {
    title: "توسعه و SEO در یک مسیر",
    body: "ساختار فنی و دیده‌شدن در جستجو از ابتدا کنار هم دیده می‌شوند.",
  },
  { title: "مالکیت روشن", body: "کد، دسترسی‌ها و داده‌ها متعلق به شماست." },
  { title: "رابطه بعد از تحویل", body: "تحویل پایان کار نیست؛ نقطه شروع نگهداری و توسعه است." },
];

export function WhyRycode() {
  return (
    <Section className="bg-surface">
      <Container>
        <Eyebrow>چرا رای‌کد</Eyebrow>
        <SectionTitle>تصمیم فنی خوب از فهم درست مسئله شروع می‌شود.</SectionTitle>

        <div className="mt-12 grid gap-x-16 gap-y-0 lg:grid-cols-2">
          {whyItems.map((item) => (
            <div key={item.title} className="flex gap-4 border-b border-border py-7">
              <Check className="mt-1 size-4 shrink-0 text-brand" />
              <div>
                <h3 className="text-base font-bold">{item.title}</h3>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}

/* 10. PROCESS ----------------------------------------------------------- */

export function ProcessSection() {
  const stages = ["شناخت", "تعریف", "طراحی", "توسعه", "تست", "انتشار", "بهبود"];
  return (
    <Section>
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Eyebrow>فرآیند</Eyebrow>
            <SectionTitle>مسیری که هر پروژه طی می‌کند.</SectionTitle>
          </div>
          <TextLink to="/process">جزئیات فرآیند</TextLink>
        </div>

        <ol className="mt-14 grid grid-cols-2 gap-px bg-border sm:grid-cols-4 lg:grid-cols-7">
          {stages.map((stage, i) => (
            <li key={stage} className="bg-background p-6">
              <span className="font-display text-xs text-brand" dir="ltr">
                0{i + 1}
              </span>
              <p className="mt-3 text-sm font-bold">{stage}</p>
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  );
}

/* 11. PAYMENT ----------------------------------------------------------- */

export function PaymentSection() {
  return (
    <Section className="bg-surface">
      <Container>
        <div className="grid gap-12 border border-border bg-background p-10 sm:p-14 lg:grid-cols-[1fr_1fr]">
          <div>
            <Eyebrow>پرداخت</Eyebrow>
            <SectionTitle className="text-2xl sm:text-3xl">
              پرداخت پروژه می‌تواند با مراحل اجرا هماهنگ باشد.
            </SectionTitle>
          </div>
          <div className="text-sm leading-8 text-muted-foreground">
            <p>
              در پروژه‌های واجد شرایط، هزینه می‌تواند به مراحل مشخص اجرا تقسیم شود؛ هر مرحله پس از
              تحویل و تایید خروجی آن مرحله تسویه می‌شود.
            </p>
            <p className="mt-4">
              شرایط پرداخت مرحله‌ای بسته به دامنه، مدت و ریسک فنی پروژه در جلسه شناخت بررسی و در
              قرارداد ثبت می‌شود.
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

/* 12. BLOG -------------------------------------------------------------- */

export function BlogSection() {
  const categories = [
    "طراحی سایت",
    "فروشگاه اینترنتی",
    "سئو",
    "وردپرس",
    "برنامه‌نویسی",
    "رفع مشکلات",
    "کسب‌وکار دیجیتال",
    "راهنماها",
    "مقایسه‌ها",
  ];

  return (
    <Section>
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Eyebrow>بلاگ</Eyebrow>
            <SectionTitle>
              درباره ساخت، رشد و نگهداری محصولات دیجیتال می‌نویسیم.
            </SectionTitle>
          </div>
          <TextLink to="/blog">همه مقاله‌ها</TextLink>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1.3fr_1fr]">
          <div className="flex min-h-56 flex-col justify-center border border-dashed border-border p-10">
            <p className="text-sm font-bold">مقاله شاخص</p>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              هنوز مقاله‌ای منتشر نشده است. پس از انتشار، مقاله شاخص در این بخش نمایش داده می‌شود.
            </p>
          </div>
          <div className="flex min-h-56 flex-col justify-center border border-dashed border-border p-10">
            <p className="text-sm font-bold">آخرین مقاله‌ها</p>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              لیست جدیدترین مقاله‌ها به‌محض انتشار محتوا در این بخش قرار می‌گیرد.
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          {categories.map((c) => (
            <span key={c} className="border border-border px-3 py-1.5 text-xs text-muted-foreground">
              {c}
            </span>
          ))}
        </div>
      </Container>
    </Section>
  );
}

/* 13. FAQ --------------------------------------------------------------- */

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
  return (
    <Section className="bg-surface">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr]">
          <div>
            <Eyebrow>سوالات متداول</Eyebrow>
            <SectionTitle className="text-2xl sm:text-3xl">پرسش‌های پرتکرار</SectionTitle>
          </div>
          <div className="border-t border-border">
            {faqs.map((f, i) => (
              <div key={f.q} className="border-b border-border">
                <button
                  type="button"
                  onClick={() => setOpen(open === i ? null : i)}
                  className="flex w-full items-center justify-between gap-6 py-6 text-start text-base font-bold"
                  aria-expanded={open === i}
                >
                  {f.q}
                  <span className="text-brand">{open === i ? "−" : "+"}</span>
                </button>
                {open === i && (
                  <p className="pb-6 text-sm leading-8 text-muted-foreground">{f.a}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}

/* 14. FINAL CTA --------------------------------------------------------- */

export function FinalCta() {
  return (
    <section className="bg-ink py-24 text-ink-foreground sm:py-32">
      <Container className="text-center">
        <h2 className="mx-auto max-w-2xl text-[1.9rem] leading-[1.35] font-extrabold sm:text-[2.6rem] sm:leading-[1.25]">
          پروژه‌ای در ذهن دارید؟
          <br />
          یا <span className="text-brand">مشکلی</span> دارید که باید حل شود؟
        </h2>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <CtaLink to="/start-project">شروع پروژه</CtaLink>
          <CtaLink
            to="/technical-review"
            variant="outline"
            className="border-white/20 text-ink-foreground hover:border-white/50 hover:bg-white/5"
          >
            درخواست بررسی فنی
          </CtaLink>
        </div>
      </Container>
    </section>
  );
}
