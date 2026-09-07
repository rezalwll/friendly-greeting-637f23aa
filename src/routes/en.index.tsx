import { createFileRoute, Link } from "@tanstack/react-router";

import { Container, Eyebrow, Lead, Section, SectionTitle } from "@/components/site/primitives";

const title = "RYCODE | Software Development, Web & Digital Growth Studio";
const description =
  "RYCODE is a technical partner for businesses: web platforms, ecommerce, custom software, integrations and SEO — from idea to execution.";

export const Route = createFileRoute("/en/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "en_US" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

const pillars = [
  { title: "Build", body: "New websites, stores and platforms designed around a business goal." },
  { title: "Develop", body: "Extending existing systems instead of restarting from zero." },
  { title: "Rescue", body: "Taking over stalled, slow or unstable projects." },
  { title: "Grow", body: "SEO, performance and conversion work after launch." },
  { title: "Maintain", body: "Long-term support, monitoring and incremental improvement." },
];

function Page() {
  return (
    <>
      <Section>
        <Container>
          <Eyebrow>RYCODE</Eyebrow>
          <h1 className="mt-5 max-w-3xl text-[2.1rem] leading-[1.2] font-extrabold sm:text-[3rem]">
            We solve business problems with software.
            <br />
            <span className="text-brand">Technology is a tool, not the goal.</span>
          </h1>
          <Lead className="max-w-2xl">
            RYCODE designs, builds and maintains web platforms, ecommerce systems, custom software
            and integrations for companies that need a dependable technical partner.
          </Lead>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              to="/en/contact"
              className="inline-flex h-11 items-center rounded-md bg-brand px-7 text-sm font-semibold text-brand-foreground hover:bg-brand/90"
            >
              Start a conversation
            </Link>
            <Link
              to="/en/services"
              className="inline-flex h-11 items-center rounded-md border border-border px-7 text-sm font-semibold hover:bg-secondary"
            >
              Explore services
            </Link>
          </div>
        </Container>
      </Section>

      <Section className="bg-surface">
        <Container>
          <SectionTitle>Five ways we work</SectionTitle>
          <div className="mt-10 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-5">
            {pillars.map((p) => (
              <article key={p.title} className="bg-background p-6">
                <h2 className="text-sm font-bold text-brand">{p.title}</h2>
                <p className="mt-3 text-xs leading-6 text-muted-foreground">{p.body}</p>
              </article>
            ))}
          </div>
          <p className="mt-8 text-sm text-muted-foreground">
            The English section is a summary. The complete, continuously updated content lives in
            the{" "}
            <Link to="/" className="font-semibold text-brand hover:underline">
              Persian version
            </Link>
            .
          </p>
        </Container>
      </Section>
    </>
  );
}
