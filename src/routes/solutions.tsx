import { createFileRoute } from "@tanstack/react-router";
import { Container, CtaLink, Eyebrow, Lead, SectionTitle } from "@/components/site/primitives";

const title = "راهکارهای رای‌کد | CRM، پنل مشتری، سفارش‌گیری و پلتفرم‌ها";
const description = "سیستم‌هایی که برای فروش، عملیات، پلتفرم و خدمات پس از فروش کسب‌وکارها می‌سازیم.";

export const Route = createFileRoute("/solutions")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <div className="py-24 sm:py-32">
      <Container>
        <Eyebrow>راهکارها</Eyebrow>
        <SectionTitle>راهکارها</SectionTitle>
        <Lead>
          این صفحه در مرحله بعدی با ترکیب اختصاصی خود (Product / System Explorer) ساخته می‌شود. ساختار، ناوبری و
          سیستم طراحی آماده است.
        </Lead>
        <div className="mt-10 flex flex-wrap gap-3">
          <CtaLink to="/start-project">شروع پروژه</CtaLink>
          <CtaLink to="/" variant="outline">
            بازگشت به خانه
          </CtaLink>
        </div>
      </Container>
    </div>
  );
}
