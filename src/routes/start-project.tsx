import { createFileRoute } from "@tanstack/react-router";

import { Breadcrumbs, PageHeader, PageShell } from "@/components/site/collection";
import { LeadWizard, type WizardStep } from "@/components/site/lead-wizard";

const title = "شروع پروژه با رای‌کد | ثبت درخواست ساخت یا توسعه";
const description =
  "فرم چندمرحله‌ای شروع پروژه رای‌کد؛ نوع پروژه، وضعیت فعلی، اهداف، بودجه و زمان‌بندی را مشخص کنید.";

export const Route = createFileRoute("/start-project")({
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

const steps: WizardStep[] = [
  {
    title: "نوع پروژه",
    hint: "اول مشخص کنیم چه چیزی قرار است ساخته یا اصلاح شود.",
    fields: [
      {
        name: "project_type",
        label: "نوع پروژه",
        type: "choice",
        required: true,
        options: [
          "طراحی سایت",
          "فروشگاه اینترنتی",
          "نرم‌افزار اختصاصی",
          "پنل مدیریت",
          "اپلیکیشن وب",
          "یکپارچه‌سازی",
          "بهبود و توسعه پروژه موجود",
          "سئو و رشد",
        ],
      },
    ],
  },
  {
    title: "وضعیت فعلی",
    hint: "بدانیم از کجا شروع می‌کنیم.",
    fields: [
      {
        name: "current_state",
        label: "وضعیت فعلی",
        type: "choice",
        required: true,
        options: ["هنوز چیزی ندارم", "سایت فعلی دارم", "پروژه نیمه‌کاره دارم", "سیستم داخلی دارم"],
      },
      { name: "current_url", label: "نشانی سایت یا پروژه فعلی (اختیاری)", type: "text", dir: "ltr" },
    ],
  },
  {
    title: "هدف و نیازها",
    hint: "چه نتیجه‌ای برای شما موفقیت حساب می‌شود؟",
    fields: [
      {
        name: "goals",
        label: "اهداف اصلی",
        type: "choice",
        multi: true,
        options: [
          "افزایش فروش",
          "جذب سرنخ بیشتر",
          "کاهش کار دستی",
          "بهبود سرعت",
          "بهبود سئو",
          "نظم داده و گزارش",
          "تجربه کاربری بهتر",
        ],
      },
      {
        name: "features",
        label: "امکانات موردنیاز",
        type: "choice",
        multi: true,
        options: [
          "پرداخت آنلاین",
          "ورود کاربران",
          "پنل مشتری",
          "چندزبانه",
          "بلاگ / محتوا",
          "اتصال به انبار یا حسابداری",
          "گزارش‌گیری",
        ],
      },
    ],
  },
  {
    title: "بودجه و زمان",
    fields: [
      {
        name: "budget",
        label: "بازه بودجه",
        type: "choice",
        required: true,
        options: ["زیر ۵۰ میلیون", "۵۰ تا ۱۵۰ میلیون", "۱۵۰ تا ۴۰۰ میلیون", "بالای ۴۰۰ میلیون", "هنوز مشخص نیست"],
      },
      {
        name: "timeline",
        label: "زمان‌بندی موردنظر",
        type: "choice",
        required: true,
        options: ["فوری", "تا یک ماه", "یک تا سه ماه", "انعطاف‌پذیر"],
      },
      {
        name: "files",
        label: "پیوست فایل",
        type: "upload-placeholder",
        note: "ارسال فایل در این مرحله فعال نیست. پس از تماس اولیه، مسیر امن ارسال مستندات در پنل مشتری برای شما باز می‌شود.",
      },
    ],
  },
  {
    title: "اطلاعات تماس",
    hint: "برای هماهنگی جلسه شناخت.",
    fields: [
      { name: "name", label: "نام و نام خانوادگی", type: "text", required: true },
      { name: "company", label: "نام کسب‌وکار", type: "text" },
      { name: "phone", label: "شماره تماس", type: "text", required: true, dir: "ltr" },
      { name: "email", label: "ایمیل", type: "text", dir: "ltr" },
      { name: "summary", label: "توضیح کوتاه پروژه", type: "textarea", required: true },
    ],
  },
];

function Page() {
  return (
    <PageShell>
      <div className="mx-auto max-w-3xl">
        <Breadcrumbs items={[{ label: "شروع پروژه" }]} />
        <PageHeader
          eyebrow="شروع پروژه"
          title="پروژه‌تان را شروع کنیم"
          lead="در پنج گام کوتاه نیازتان را مشخص کنید؛ درخواست مستقیم وارد سامانه داخلی رای‌کد می‌شود و در پنل مدیریت پیگیری خواهد شد."
        />
        <div className="mt-10">
          <LeadWizard
            leadType="project_request"
            steps={steps}
            serviceField="project_type"
            budgetField="budget"
            startedEvent="project_form_started"
            completedEvent="project_form_completed"
            submitLabel="ثبت درخواست پروژه"
            successTitle="درخواست پروژه ثبت شد"
          />
        </div>
      </div>
    </PageShell>
  );
}
