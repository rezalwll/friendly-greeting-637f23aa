import { createFileRoute, Link } from "@tanstack/react-router";

import { Container, Eyebrow, Lead, Section } from "@/components/site/primitives";

const title = "About RYCODE | Technical Partner for Growing Businesses";
const description =
  "RYCODE builds and maintains digital products for businesses. Problem first, technology second, clear ownership always.";

export const Route = createFileRoute("/en/about")({
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

const principles = [
  { title: "Problem before tool", body: "We define the business problem before choosing a framework or platform." },
  { title: "Extend, don't restart", body: "Rebuilding from scratch is a last resort, not a default proposal." },
  { title: "Clear ownership", body: "Code, hosting, domains and accounts belong to the client. Always." },
  { title: "Life after delivery", body: "Launch is a milestone, not the end of the relationship." },
];

function Page() {
  return (
    <Section>
      <Container>
        <Eyebrow>About</Eyebrow>
        <h1 className="mt-5 text-[2rem] leading-[1.25] font-bold sm:text-[2.6rem]">About RYCODE</h1>
        <Lead className="max-w-2xl">
          RYCODE (رای‌کد) is a software and web studio working with companies that need software to
          support real operations — not a showcase project.
        </Lead>
        <div className="mt-10 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2">
          {principles.map((p) => (
            <article key={p.title} className="bg-background p-7">
              <h2 className="text-base font-bold">{p.title}</h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{p.body}</p>
            </article>
          ))}
        </div>
        <p className="mt-8 text-sm text-muted-foreground">
          Full company information is available in the{" "}
          <Link to="/about" className="font-semibold text-brand hover:underline">
            Persian about page
          </Link>
          .
        </p>
      </Container>
    </Section>
  );
}
