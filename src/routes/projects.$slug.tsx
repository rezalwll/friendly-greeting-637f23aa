import { createFileRoute } from "@tanstack/react-router";

import { ContentDetailPage } from "@/components/site/kind-pages";

export const Route = createFileRoute("/projects/$slug")({
  head: ({ params }) => {
    const title = `مطالعه موردی ${params.slug} | رای‌کد`;
    const description = "صورت مسئله، تصمیم‌های فنی و نتیجه این پروژه رای‌کد.";
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
  return <ContentDetailPage kind="case_study" slug={slug} listTo="/projects" listLabel="پروژه‌ها" />;
}
