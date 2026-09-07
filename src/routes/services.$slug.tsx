import { createFileRoute } from "@tanstack/react-router";

import { ContentDetailPage } from "@/components/site/kind-pages";

export const Route = createFileRoute("/services/$slug")({
  head: ({ params }) => {
    const title = `خدمت ${params.slug} | رای‌کد`;
    const description = "جزئیات این خدمت رای‌کد؛ دامنه کار، خروجی‌ها و مسیر شروع پروژه.";
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
  return <ContentDetailPage kind="service" slug={slug} listTo="/services" listLabel="خدمات" />;
}
