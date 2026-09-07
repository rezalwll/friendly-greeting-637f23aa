import { createFileRoute } from "@tanstack/react-router";

import { Breadcrumbs, PageHeader, PageShell } from "@/components/site/collection";
import { LeadWizard, type WizardStep } from "@/components/site/lead-wizard";

const title = "درخواست SEO Audit | بررسی سئو سایت توسط رای‌کد";
const description =
  "درخواست بررسی سئوی سایت در چند گام؛ ساختار، سرعت، محتوا و مشکلات ایندکس به‌صورت گزارش داخلی بررسی می‌شود.";

export const Route = createFileRoute("/seo-audit")({
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
    title: "سایت شما",
    fields: [
      { name: "site_url", label: "نشانی سایت", type: "text", required: true, dir: "ltr" },
      {
        name: "platform",
        label: "پلتفرم سایت",
        type: "choice",
        options: ["وردپرس", "فروشگاه‌ساز", "سیستم اختصاصی", "نمی‌دانم"],
      },
      {
        name: "business_type",
        label: "نوع کسب‌وکار",
        type: "choice",
        options: ["فروشگاهی", "خدماتی", "تولیدی", "بازرگانی", "محتوایی"],
      },
    ],
  },
  {
    title: "وضعیت سئو",
    hint: "چه چیزی شما را نگران کرده است؟",
    fields: [
      {
        name: "seo_issues",
        label: "مشکلات مشاهده‌شده",
        type: "choice",
        multi: true,
        options: [
          "افت رتبه",
          "ایندکس‌نشدن صفحات",
          "سرعت پایین",
          "محتوای تکراری",
          "ساختار نامنظم آدرس‌ها",
          "نبود ترافیک ورودی",
          "افت فروش ارگانیک",
        ],
      },
      {
        name: "keywords",
        label: "کلمات کلیدی مهم برای شما",
        type: "text",
      },
      {
        name: "competitors",
        label: "رقبای اصلی (اختیاری)",
        type: "text",
        dir: "ltr",
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
      { name: "summary", label: "توضیح کوتاه", type: "textarea", required: true },
    ],
  },
];

function Page() {
  return (
    <PageShell>
      <div className="mx-auto max-w-3xl">
        <Breadcrumbs items={[{ label: "SEO Audit" }]} />
        <PageHeader
          eyebrow="سئو"
          title="درخواست SEO Audit"
          lead="در سه گام وضعیت سئوی سایتتان را ثبت کنید. بررسی به‌صورت دستی و داخلی انجام می‌شود؛ هیچ ابزار بیرونی به سایت شما وصل نمی‌شود."
        />
        <div className="mt-10">
          <LeadWizard
            leadType="seo_audit"
            steps={steps}
            serviceField="business_type"
            startedEvent="seo_audit_started"
            completedEvent="seo_audit_completed"
            submitLabel="ثبت درخواست سئو"
            successTitle="درخواست SEO Audit ثبت شد"
            successBody="سایت شما به‌صورت دستی بررسی می‌شود و گزارش داخلی سئو برایتان آماده خواهد شد."
          />
        </div>
      </div>
    </PageShell>
  );
}
