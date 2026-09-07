import { createFileRoute } from "@tanstack/react-router";

import { HubOutro, IndustriesHubIntro } from "@/components/site/hubs";
import { ContentListPage } from "@/components/site/kind-pages";

const title = "صنایع | تجربه رای‌کد در حوزه‌های تخصصی";
const description =
  "کاوشگر بازار: چالش رایج هر صنعت و راهکار متناسب با آن — تولید، بازرگانی، تجهیزات صنعتی، فروشگاهی، پزشکی، خودرو، آموزش و املاک.";

export const Route = createFileRoute("/industries/")({
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
      kind="industry"
      detailTo="/industries/$slug"
      eyebrow="صنایع"
      title="صفحات صنایع"
      lead="برای هر صنعت یک صفحه اختصاصی با زبان، نیاز و مسیر تبدیل همان صنعت ساخته می‌شود."
      searchLabel="جستجو در صنایع"
      emptyTitle="هنوز صنعتی منتشر نشده است"
      emptyHint="صفحات صنایع را در مدیریت محتوا بسازید؛ نمایش، جستجو و صفحه‌بندی آماده است."
      intro={<IndustriesHubIntro />}
      outro={<HubOutro />}
    />
  );
}
