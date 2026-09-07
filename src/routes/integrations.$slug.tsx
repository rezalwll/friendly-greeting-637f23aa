import { createFileRoute } from "@tanstack/react-router";

import { ContentDetailPage } from "@/components/site/kind-pages";

export const Route = createFileRoute("/integrations/$slug")({
  head: ({ params }) => {
    const title = `یکپارچه‌سازی ${params.slug} | رای‌کد`;
    const description = "جریان داده، جهت انتقال، شرط اجرا، ملاحظات امنیتی و مدیریت خطا در این یکپارچه‌سازی.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: Page,
});

function Page() {
  return (
    <ContentDetailPage
      kind="integration"
      slug={Route.useParams().slug}
      listTo="/integrations"
      listLabel="یکپارچه‌سازی"
    />
  );
}
