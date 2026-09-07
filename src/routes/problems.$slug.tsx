import { createFileRoute } from "@tanstack/react-router";

import { ContentDetailPage } from "@/components/site/kind-pages";

export const Route = createFileRoute("/problems/$slug")({
  head: ({ params }) => {
    const title = `راه‌حل ${params.slug} | رای‌کد`;
    const description = "تشخیص، مسیر حل و خروجی نهایی برای این مشکل رایج پروژه‌های دیجیتال.";
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
  const { slug } = Route.useParams();
  return <ContentDetailPage kind="problem" slug={slug} listTo="/problems" listLabel="مشکلات" />;
}
