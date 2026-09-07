import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeftRight, CreditCard, Database, FileSpreadsheet, MessageSquare, Package, Plug, Users } from "lucide-react";

import { HubOutro } from "@/components/site/hubs";
import { ContentListPage } from "@/components/site/kind-pages";
import { Eyebrow, Lead } from "@/components/site/primitives";

const title = "یکپارچه‌سازی‌ها | اتصال سیستم‌ها به یکدیگر";
const description =
  "سیستم‌های پرداخت، پیامک، CRM، انبار، حسابداری و API چطور به هم وصل می‌شوند؛ جریان داده، شرط‌ها و مدیریت خطا.";

export const Route = createFileRoute("/integrations/")({
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

const families = [
  { icon: CreditCard, title: "پرداخت", body: "ثبت تراکنش، تطبیق سفارش و وضعیت پرداخت در یک جریان مشخص." },
  { icon: MessageSquare, title: "پیامک و OTP", body: "احراز شماره، اطلاع‌رسانی وضعیت سفارش و یادآوری‌ها." },
  { icon: Users, title: "CRM", body: "انتقال سرنخ‌ها و تاریخچه ارتباط بین سایت و سیستم فروش." },
  { icon: Package, title: "انبار", body: "همگام‌سازی موجودی و جلوگیری از فروش کالای ناموجود." },
  { icon: FileSpreadsheet, title: "حسابداری", body: "ارسال فاکتور و اسناد مالی به سیستم حسابداری." },
  { icon: Plug, title: "API", body: "طراحی و مصرف API برای ارتباط دو سیستم مستقل." },
  { icon: ArrowLeftRight, title: "ایمپورت / اکسپورت", body: "ورود و خروج داده به‌صورت فایل، برای مهاجرت یا گزارش." },
  { icon: Database, title: "همگام‌سازی داده", body: "نگه‌داشتن دو منبع داده در یک وضعیت، با قواعد روشن." },
];

function Intro() {
  return (
    <>
      <Eyebrow>یکپارچه‌سازی</Eyebrow>
      <h1 className="mt-5 max-w-3xl text-[2rem] leading-[1.35] font-bold sm:text-[2.6rem] sm:leading-[1.25]">
        وقتی سیستم‌ها با هم حرف بزنند، کار دستی حذف می‌شود.
      </h1>
      <Lead className="max-w-2xl">
        یکپارچه‌سازی یعنی مشخص‌کردن اینکه چه داده‌ای، در چه لحظه‌ای، در کدام جهت و با چه قاعده‌ای
        بین دو سیستم جابه‌جا شود — و وقتی خطا رخ داد چه اتفاقی بیفتد.
      </Lead>

      <div className="mt-10 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
        {families.map((f) => (
          <section key={f.title} className="bg-background p-6">
            <f.icon className="size-5 text-brand" aria-hidden />
            <h2 className="mt-4 text-sm font-bold">{f.title}</h2>
            <p className="mt-2 text-xs leading-6 text-muted-foreground">{f.body}</p>
          </section>
        ))}
      </div>

      <p className="mt-6 max-w-2xl text-sm leading-7 text-muted-foreground">
        اتصال به هر سرویس بیرونی فقط با تأیید و حساب کاربری خود شما انجام می‌شود؛ رای‌کد از طرف شما
        هیچ سرویسی را بدون هماهنگی متصل نمی‌کند.
      </p>
    </>
  );
}

function Page() {
  return (
    <ContentListPage
      kind="integration"
      detailTo="/integrations/$slug"
      eyebrow="یکپارچه‌سازی"
      title="یکپارچه‌سازی‌های مستند"
      lead="هر یکپارچه‌سازی صفحه اختصاصی خود را با جریان داده، شرط‌ها و ملاحظات امنیتی دارد."
      searchLabel="جستجو در یکپارچه‌سازی‌ها"
      emptyTitle="هنوز یکپارچه‌سازی منتشر نشده است"
      emptyHint="موارد یکپارچه‌سازی را در مدیریت محتوا ثبت کنید تا اینجا نمایش داده شوند."
      intro={<Intro />}
      outro={<HubOutro />}
    />
  );
}
