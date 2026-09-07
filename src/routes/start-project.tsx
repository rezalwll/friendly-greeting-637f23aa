import { createFileRoute } from "@tanstack/react-router";
import { Container, CtaLink, Eyebrow, Lead, SectionTitle } from "@/components/site/primitives";

const title = "شروع پروژه | فرم چندمرحله‌ای رای‌کد";
const description = "درخواست شروع پروژه در رای‌کد: نوع پروژه، وضعیت فعلی، جزئیات، زمان و بودجه.";

export const Route = createFileRoute("/start-project")({
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
        <Eyebrow>شروع پروژه</Eyebrow>
        <SectionTitle>شروع پروژه</SectionTitle>
        <Lead>
          این صفحه در مرحله بعدی با ترکیب اختصاصی خود (Conversion) ساخته می‌شود. ساختار، ناوبری و
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
