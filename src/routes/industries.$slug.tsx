import { createFileRoute } from "@tanstack/react-router";

import { ContentDetailPage } from "@/components/site/kind-pages";

export const Route = createFileRoute("/industries/$slug")({
  head: ({ params }) => {
    const title = `صنعت ${params.slug} | رای‌کد`;
    const description = "نیازها، الگوهای رایج و راهکارهای رای‌کد برای این صنعت.";
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
  return <ContentDetailPage kind="industry" slug={slug} listTo="/industries" listLabel="صنایع" />;
}
