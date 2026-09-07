import { createFileRoute } from "@tanstack/react-router";

import { ContentListPage } from "@/components/site/kind-pages";

const title = "پروژه‌ها و نمونه‌کارها | رای‌کد";
const description =
  "نمونه‌کارها و مطالعات موردی رای‌کد؛ صورت مسئله، تصمیم فنی و نتیجه هر پروژه.";

export const Route = createFileRoute("/projects/")({
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
      kind="case_study"
      detailTo="/projects/$slug"
      eyebrow="پروژه‌ها"
      title="پروژه‌ها"
      lead="مطالعات موردی واقعی پس از تأیید مشتری اینجا منتشر می‌شود؛ هیچ نمونه‌کار ساختگی نمایش داده نمی‌شود."
      searchLabel="جستجو در پروژه‌ها"
      emptyTitle="هنوز مطالعه موردی منتشر نشده است"
      emptyHint="پس از تأیید مشتری، پروژه‌ها را در مدیریت محتوا منتشر کنید تا اینجا نمایش داده شوند."
    />
  );
}
