import { createFileRoute } from "@tanstack/react-router";
import { Container, CtaLink, Eyebrow, Lead, SectionTitle } from "@/components/site/primitives";

const title = "سوالات متداول رای‌کد";
const description = "پرسش‌های پرتکرار درباره هزینه، زمان، مالکیت کد و پشتیبانی پروژه‌ها.";

export const Route = createFileRoute("/faq")({
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
        <Eyebrow>سوالات متداول</Eyebrow>
        <SectionTitle>سوالات متداول</SectionTitle>
        <Lead>
          این صفحه در مرحله بعدی با ترکیب اختصاصی خود (FAQ) ساخته می‌شود. ساختار، ناوبری و
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
