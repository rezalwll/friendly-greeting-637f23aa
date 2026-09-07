import { createFileRoute } from "@tanstack/react-router";

import { ContentListPage } from "@/components/site/kind-pages";

const title = "خدمات رای‌کد | ساخت، توسعه، حل مسئله، رشد و پشتیبانی";
const description =
  "همه خدمات رای‌کد در پنج گروه ساخت، توسعه، حل مشکل، رشد و پشتیبانی؛ از طراحی سایت تا نرم‌افزار اختصاصی و سئو.";

export const Route = createFileRoute("/services/")({
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
    <ContentListPage
      kind="service"
      detailTo="/services/$slug"
      eyebrow="خدمات"
      title="خدمات رای‌کد"
      lead="فهرست خدمات از مدیریت محتوای داخلی خوانده می‌شود؛ هر خدمت صفحه اختصاصی خود را دارد."
      searchLabel="جستجو در خدمات"
      emptyTitle="هنوز خدمتی منتشر نشده است"
      emptyHint="پس از ثبت خدمات در بخش مدیریت محتوا، همین‌جا با جستجو و صفحه‌بندی نمایش داده می‌شوند."
    />
  );
}
