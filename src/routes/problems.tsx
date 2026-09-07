import { createFileRoute } from "@tanstack/react-router";
import { Container, CtaLink, Eyebrow, Lead, SectionTitle } from "@/components/site/primitives";

const title = "رفع مشکلات فنی | باگ، کندی، پروژه نیمه‌کاره";
const description = "از رفع باگ و افزایش سرعت تا تکمیل پروژه نیمه‌کاره و مهاجرت؛ مسیر تشخیص و حل مسئله در رای‌کد.";

export const Route = createFileRoute("/problems")({
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
        <Eyebrow>مشکلات رایج</Eyebrow>
        <SectionTitle>مشکلات رایج</SectionTitle>
        <Lead>
          این صفحه در مرحله بعدی با ترکیب اختصاصی خود (Diagnostic Experience) ساخته می‌شود. ساختار، ناوبری و
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
