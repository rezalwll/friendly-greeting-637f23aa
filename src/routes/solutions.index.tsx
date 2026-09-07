import { createFileRoute } from "@tanstack/react-router";

import { HubOutro, SolutionsHubIntro } from "@/components/site/hubs";
import { ContentListPage } from "@/components/site/kind-pages";

const title = "راهکارهای رای‌کد | نرم‌افزار، پنل و پلتفرم اختصاصی";
const description =
  "کاوشگر راهکارها: فروش و مشتری، عملیات، رزرو و خدمات، پس از فروش، پلتفرم و داده و گزارش.";

export const Route = createFileRoute("/solutions/")({
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
      kind="solution"
      detailTo="/solutions/$slug"
      eyebrow="راهکارها"
      title="راهکارهای رای‌کد"
      lead="راهکارها از مدیریت محتوای داخلی می‌آیند و هرکدام صفحه، سئو و مسیر تبدیل مستقل دارند."
      searchLabel="جستجو در راهکارها"
      emptyTitle="هنوز راهکاری منتشر نشده است"
      emptyHint="راهکارها را در بخش مدیریت محتوا بسازید تا اینجا با جستجو و صفحه‌بندی نمایش داده شوند."
      intro={<SolutionsHubIntro />}
      outro={<HubOutro />}
    />
  );
}
