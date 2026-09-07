import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { Breadcrumbs, EmptyState, PageHeader, PageShell } from "@/components/site/collection";
import { CtaLink } from "@/components/site/primitives";
import { publicFaqsQuery } from "@/lib/public-content";

const title = "سوالات متداول رای‌کد | هزینه، زمان، قرارداد و پشتیبانی";
const description = "پاسخ پرسش‌های رایج درباره روند کار، زمان‌بندی، پرداخت مرحله‌ای و پشتیبانی رای‌کد.";

export const Route = createFileRoute("/faq")({
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
  const { data, isPending, isError } = useQuery(publicFaqsQuery());

  return (
    <PageShell>
      <div className="mx-auto max-w-3xl">
        <Breadcrumbs items={[{ label: "سوالات متداول" }]} />
        <PageHeader
          eyebrow="سوالات متداول"
          title="سوالات متداول"
          lead="پرسش‌ها از مدیریت محتوای داخلی خوانده می‌شوند و همیشه با آخرین پاسخ‌ها به‌روزند."
        />

        {isPending ? (
          <div className="mt-10 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-14 animate-pulse rounded-md border border-border bg-secondary/50" />
            ))}
          </div>
        ) : isError ? (
          <div className="mt-10">
            <EmptyState title="بارگذاری انجام نشد" hint="لطفاً صفحه را دوباره باز کنید." />
          </div>
        ) : data.length === 0 ? (
          <div className="mt-10">
            <EmptyState
              title="هنوز پرسشی ثبت نشده است"
              hint="پرسش‌های متداول را در بخش مدیریت محتوا اضافه کنید تا اینجا نمایش داده شوند."
            />
          </div>
        ) : (
          <div className="mt-10 divide-y divide-border border-y border-border">
            {data.map((faq) => (
              <details key={faq.id} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">
                  {faq.question_fa}
                  <span aria-hidden className="text-brand transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-4 text-sm leading-8 text-muted-foreground">{faq.answer_fa}</p>
              </details>
            ))}
          </div>
        )}

        <div className="mt-14 flex flex-wrap gap-3 border-t border-border pt-10">
          <CtaLink to="/contact">پرسش دیگری دارید؟</CtaLink>
          <CtaLink to="/start-project" variant="outline">
            شروع پروژه
          </CtaLink>
        </div>
      </div>
    </PageShell>
  );
}
