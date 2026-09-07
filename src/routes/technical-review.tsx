import { createFileRoute } from "@tanstack/react-router";

import { Breadcrumbs, PageHeader, PageShell } from "@/components/site/collection";
import { LeadWizard, type WizardStep } from "@/components/site/lead-wizard";

const title = "درخواست بررسی فنی پروژه | رای‌کد";
const description =
  "بررسی فنی پروژه‌های نیمه‌کاره، کند یا پرباگ در چند گام کوتاه؛ گزارش وضعیت و مسیر پیشنهادی رای‌کد.";

export const Route = createFileRoute("/technical-review")({
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
    title: "نوع مشکل",
    hint: "کدام مورد به وضعیت فعلی شما نزدیک‌تر است؟",
    fields: [
      {
        name: "problem_type",
        label: "مشکل اصلی",
        type: "choice",
        required: true,
        options: [
          "پروژه نیمه‌کاره",
          "سایت کند",
          "باگ‌های تکراری",
          "افت رتبه سئو",
          "عدم دسترسی به کد یا هاست",
          "توسعه‌ناپذیری سیستم فعلی",
          "مشکل امنیتی",
        ],
      },
      {
        name: "urgency",
        label: "فوریت",
        type: "choice",
        required: true,
        options: ["بحرانی — سایت از کار افتاده", "زیاد", "متوسط", "برنامه‌ریزی‌شده"],
      },
    ],
  },
  {
    title: "وضعیت فنی",
    hint: "هرچه دقیق‌تر، بررسی سریع‌تر.",
    fields: [
      { name: "site_url", label: "نشانی سایت یا پروژه", type: "text", dir: "ltr" },
      {
        name: "platform",
        label: "پلتفرم فعلی",
        type: "choice",
        options: ["وردپرس", "لاراول", "React / Next", "سیستم اختصاصی", "نمی‌دانم"],
      },
      {
        name: "access",
        label: "دسترسی‌های موجود",
        type: "choice",
        multi: true,
        options: ["کد منبع", "هاست/سرور", "پنل مدیریت", "دامنه", "هیچ‌کدام"],
      },
      {
        name: "files",
        label: "پیوست گزارش یا اسکرین‌شات",
        type: "upload-placeholder",
        note: "ارسال فایل در این فرم فعال نیست. پس از ثبت درخواست، مسیر امن ارسال مستندات هماهنگ می‌شود.",
      },
    ],
  },
  {
    title: "اطلاعات تماس",
    fields: [
      { name: "name", label: "نام و نام خانوادگی", type: "text", required: true },
      { name: "company", label: "نام کسب‌وکار", type: "text" },
      { name: "phone", label: "شماره تماس", type: "text", required: true, dir: "ltr" },
      { name: "email", label: "ایمیل", type: "text", dir: "ltr" },
      { name: "summary", label: "توضیح وضعیت فعلی", type: "textarea", required: true },
    ],
  },
];

function Page() {
  return (
    <PageShell>
      <div className="mx-auto max-w-3xl">
        <Breadcrumbs items={[{ label: "بررسی فنی" }]} />
        <PageHeader
          eyebrow="بررسی فنی"
          title="درخواست بررسی فنی"
          lead="در سه گام وضعیت پروژه‌تان را ثبت کنید؛ نتیجه بررسی به‌صورت گزارش داخلی برای شما آماده می‌شود."
        />
        <div className="mt-10">
          <LeadWizard
            leadType="technical_review"
            steps={steps}
            serviceField="problem_type"
            startedEvent="technical_review_started"
            completedEvent="technical_review_completed"
            submitLabel="ثبت درخواست بررسی"
            successTitle="درخواست بررسی فنی ثبت شد"
            successBody="وضعیت پروژه شما بررسی می‌شود و نتیجه به‌صورت گزارش داخلی در اختیارتان قرار می‌گیرد."
          />
        </div>
      </div>
    </PageShell>
  );
}
