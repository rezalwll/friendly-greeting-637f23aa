import { createFileRoute } from "@tanstack/react-router";

import { Breadcrumbs, PageHeader, PageShell } from "@/components/site/collection";
import { LeadForm } from "@/components/site/lead-form";

const title = "درخواست SEO Audit | بررسی سئو سایت توسط رای‌کد";
const description =
  "درخواست بررسی سئوی سایت؛ ساختار، سرعت، محتوا و مشکلات ایندکس به‌صورت گزارش داخلی بررسی می‌شود.";

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

function Page() {
  return (
    <PageShell>
      <div className="mx-auto max-w-3xl">
        <Breadcrumbs items={[{ label: "SEO Audit" }]} />
        <PageHeader
          eyebrow="سئو"
          title="درخواست SEO Audit"
          lead="نشانی سایت و مشکل فعلی‌تان را بنویسید. بررسی به‌صورت دستی و داخلی انجام می‌شود؛ هیچ ابزار بیرونی به سایت شما وصل نمی‌شود."
        />
        <div className="mt-10">
          <LeadForm
            leadType="seo_audit"
            fields={["name", "company", "phone", "email", "summary"]}
            startedEvent="seo_audit_started"
            completedEvent="seo_audit_completed"
            submitLabel="ثبت درخواست سئو"
            successTitle="درخواست SEO Audit ثبت شد"
          />
        </div>
      </div>
    </PageShell>
  );
}
