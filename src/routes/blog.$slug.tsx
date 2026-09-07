import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import {
  Breadcrumbs,
  DetailBody,
  DetailCta,
  EmptyState,
  PageShell,
} from "@/components/site/collection";
import { articleQuery } from "@/lib/public-content";
import { formatDate } from "@/lib/workspace/labels";

export const Route = createFileRoute("/blog/$slug")({
  head: ({ params }) => {
    const title = `${params.slug} | بلاگ رای‌کد`;
    const description = "مقاله بلاگ رای‌کد درباره ساخت، رشد و نگهداری محصولات دیجیتال.";
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
  const { data, isPending, isError } = useQuery(articleQuery(slug));

  if (isPending) {
    return (
      <PageShell>
        <div className="h-64 animate-pulse rounded-lg border border-border bg-secondary/50" />
      </PageShell>
    );
  }

  if (isError || !data) {
    return (
      <PageShell>
        <Breadcrumbs items={[{ label: "بلاگ", to: "/blog" }, { label: "یافت نشد" }]} />
        <EmptyState
          title="این مقاله منتشر نشده است"
          hint="نشانی مقاله در مدیریت محتوا وجود ندارد یا هنوز منتشر نشده است."
        />
      </PageShell>
    );
  }

  return (
    <PageShell>
      <article className="mx-auto max-w-3xl">
        <Breadcrumbs items={[{ label: "بلاگ", to: "/blog" }, { label: data.title_fa }]} />
        <p className="text-xs text-muted-foreground">
          {data.published_at ? formatDate(data.published_at) : ""}
        </p>
        <h1 className="mt-3 text-[1.9rem] leading-[1.4] font-bold sm:text-[2.2rem]">
          {data.title_fa}
        </h1>
        {data.excerpt_fa && (
          <p className="mt-5 text-base leading-8 text-muted-foreground">{data.excerpt_fa}</p>
        )}
        <DetailBody body={data.body_fa} />
        <DetailCta />
      </article>
    </PageShell>
  );
}
