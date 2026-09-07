import { createFileRoute } from "@tanstack/react-router";
import { Container, CtaLink, Eyebrow, Lead, SectionTitle } from "@/components/site/primitives";

const title = "پروژه‌ها | مسئله‌هایی که حل کرده‌ایم";
const description = "نمونه پروژه‌های رای‌کد بر اساس مسئله، راه‌حل و خدمات به‌کاررفته.";

export const Route = createFileRoute("/projects")({
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
        <Eyebrow>پروژه‌ها</Eyebrow>
        <SectionTitle>پروژه‌ها</SectionTitle>
        <Lead>
          این صفحه در مرحله بعدی با ترکیب اختصاصی خود (Case Studies) ساخته می‌شود. ساختار، ناوبری و
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
