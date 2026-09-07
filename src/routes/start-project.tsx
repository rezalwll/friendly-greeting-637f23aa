import { createFileRoute } from "@tanstack/react-router";

import { Breadcrumbs, PageHeader, PageShell } from "@/components/site/collection";
import { LeadForm } from "@/components/site/lead-form";

const title = "شروع پروژه با رای‌کد | ثبت درخواست ساخت یا توسعه";
const description =
  "فرم شروع پروژه رای‌کد؛ نیاز خود را ثبت کنید تا مسیر فنی، زمان‌بندی و مراحل پرداخت مشخص شود.";

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

function Page() {
  return (
    <PageShell>
      <div className="mx-auto max-w-3xl">
        <Breadcrumbs items={[{ label: "شروع پروژه" }]} />
        <PageHeader
          eyebrow="شروع پروژه"
          title="پروژه‌تان را شروع کنیم"
          lead="فرم را کامل کنید؛ درخواست شما مستقیم وارد سامانه داخلی رای‌کد می‌شود و در پنل مدیریت پیگیری خواهد شد."
        />
        <div className="mt-10">
          <LeadForm
            leadType="project_request"
            fields={["name", "company", "phone", "email", "service", "budget", "summary"]}
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
