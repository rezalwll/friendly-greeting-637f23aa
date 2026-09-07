import { createFileRoute, Link } from "@tanstack/react-router";

import { Container, Eyebrow, Lead, Section } from "@/components/site/primitives";

const title = "Contact RYCODE | Start a Project Conversation";
const description =
  "Get in touch with RYCODE about a new build, an existing system, a stalled project or SEO and growth work.";

export const Route = createFileRoute("/en/contact")({
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

const paths = [
  { to: "/start-project", title: "Start a project", body: "A guided request form for a new build or a major extension." },
  { to: "/technical-review", title: "Technical review", body: "For stalled, slow or unstable existing projects." },
  { to: "/seo-audit", title: "SEO audit", body: "A manual, internal review of your site's search performance." },
  { to: "/contact", title: "General enquiry", body: "Anything that does not fit the forms above." },
] as const;

function Page() {
  return (
    <Section>
      <Container>
        <Eyebrow>Contact</Eyebrow>
        <h1 className="mt-5 text-[2rem] leading-[1.25] font-bold sm:text-[2.6rem]">Talk to RYCODE</h1>
        <Lead className="max-w-2xl">
          Choose the request that matches your situation. All request forms are in Persian and are
          stored only in RYCODE's internal system.
        </Lead>
        <div className="mt-10 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2">
          {paths.map((p) => (
            <Link key={p.to} to={p.to} className="bg-background p-7 transition-colors hover:bg-secondary">
              <h2 className="text-base font-bold">{p.title}</h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{p.body}</p>
            </Link>
          ))}
        </div>
      </Container>
    </Section>
  );
}
