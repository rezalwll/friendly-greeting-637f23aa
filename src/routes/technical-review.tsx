import { createFileRoute } from "@tanstack/react-router";

import { Breadcrumbs, PageHeader, PageShell } from "@/components/site/collection";
import { LeadForm } from "@/components/site/lead-form";

const title = "درخواست بررسی فنی پروژه | رای‌کد";
const description =
  "بررسی فنی رایگان پروژه‌های نیمه‌کاره، کند یا پرباگ؛ گزارش وضعیت و مسیر پیشنهادی رای‌کد.";

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

function Page() {
  return (
    <PageShell>
      <div className="mx-auto max-w-3xl">
        <Breadcrumbs items={[{ label: "بررسی فنی" }]} />
        <PageHeader
          eyebrow="بررسی فنی"
          title="درخواست بررسی فنی"
          lead="وضعیت پروژه فعلی‌تان را بنویسید؛ نتیجه بررسی به‌صورت گزارش داخلی برای شما آماده می‌شود."
        />
        <div className="mt-10">
          <LeadForm
            leadType="technical_review"
            fields={["name", "company", "phone", "email", "summary"]}
            startedEvent="technical_review_started"
            completedEvent="technical_review_completed"
            submitLabel="ثبت درخواست بررسی"
            successTitle="درخواست بررسی فنی ثبت شد"
          />
        </div>
      </div>
    </PageShell>
  );
}
