import { createFileRoute } from "@tanstack/react-router";

import { ContentDetailPage } from "@/components/site/kind-pages";

export const Route = createFileRoute("/solutions/$slug")({
  head: ({ params }) => {
    const title = `راهکار ${params.slug} | رای‌کد`;
    const description = "شرح این راهکار رای‌کد؛ کاربرد، اجزا و نحوه پیاده‌سازی اختصاصی.";
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
  return <ContentDetailPage kind="solution" slug={slug} listTo="/solutions" listLabel="راهکارها" />;
}
