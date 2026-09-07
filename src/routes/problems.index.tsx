import { createFileRoute } from "@tanstack/react-router";

import { HubOutro, ProblemsHubIntro } from "@/components/site/hubs";
import { ContentListPage } from "@/components/site/kind-pages";

const title = "مشکلات رایج پروژه‌های دیجیتال | رای‌کد";
const description =
  "لازم نیست اسم راه‌حل را بدانید؛ از نشانه شروع کنید: پروژه متوقف، سایت کند، سیستم‌های جدا و گزارش‌نداشتن.";

export const Route = createFileRoute("/problems/")({
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
      kind="problem"
      detailTo="/problems/$slug"
      eyebrow="مشکلات"
      title="مشکلات ثبت‌شده"
      lead="هر مشکل صفحه راه‌حل مستقل دارد؛ فهرست از مدیریت محتوای داخلی خوانده می‌شود."
      searchLabel="جستجو در مشکلات"
      emptyTitle="هنوز موردی منتشر نشده است"
      emptyHint="فهرست مشکلات را در مدیریت محتوا بسازید تا این صفحه به‌صورت خودکار پر شود."
      intro={<ProblemsHubIntro />}
      outro={<HubOutro>اگر مطمئن نیستید مشکل از کجاست، بررسی فنی رایگان نقطه شروع خوبی است.</HubOutro>}
    />
  );
}
