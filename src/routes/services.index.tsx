import { createFileRoute } from "@tanstack/react-router";

import { HubOutro, ServicesHubIntro } from "@/components/site/hubs";
import { ContentListPage } from "@/components/site/kind-pages";

const title = "خدمات رای‌کد | ساخت، توسعه، حل مسئله، رشد و پشتیبانی";
const description =
  "نقشه توانمندی رای‌کد: از وضعیت فعلی خود شروع کنید — ساخت، توسعه پروژه موجود، یکپارچه‌سازی، رشد یا پشتیبانی.";

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
      lead="هر خدمت صفحه اختصاصی خود را دارد؛ فهرست از مدیریت محتوای داخلی خوانده می‌شود."
      searchLabel="جستجو در خدمات"
      emptyTitle="هنوز خدمتی منتشر نشده است"
      emptyHint="پس از ثبت خدمات در بخش مدیریت محتوا، همین‌جا با جستجو و صفحه‌بندی نمایش داده می‌شوند."
      intro={<ServicesHubIntro />}
      outro={<HubOutro />}
    />
  );
}
