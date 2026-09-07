import { createFileRoute } from "@tanstack/react-router";

import { ContentListPage } from "@/components/site/kind-pages";

const title = "مشکلات رایج پروژه‌های دیجیتال | رای‌کد";
const description =
  "مشکلات رایج سایت، فروشگاه و نرم‌افزار؛ از پروژه نیمه‌کاره و باگ تا افت سرعت و افت سئو، همراه با مسیر حل.";

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
      title="مشکل شما چیست؟"
      lead="ورودی مشتریانی که پروژه‌شان متوقف، کند یا ناقص مانده است؛ هر مشکل صفحه راه‌حل مستقل دارد."
      searchLabel="جستجو در مشکلات"
      emptyTitle="هنوز موردی منتشر نشده است"
      emptyHint="فهرست مشکلات را در مدیریت محتوا بسازید تا این صفحه به‌صورت خودکار پر شود."
    />
  );
}
