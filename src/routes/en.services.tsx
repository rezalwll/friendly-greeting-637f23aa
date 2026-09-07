import { createFileRoute, Link } from "@tanstack/react-router";

import { Container, Eyebrow, Lead, Section } from "@/components/site/primitives";

const title = "Services | RYCODE Software & Web Development";
const description =
  "Web design, ecommerce, custom software, admin panels, integrations, SEO and long-term maintenance by RYCODE.";

export const Route = createFileRoute("/en/services")({
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

const services = [
  { title: "Web platforms", body: "Marketing sites, portals and content platforms built for speed and search." },
  { title: "Ecommerce", body: "Online stores with reliable checkout, catalogue and operations workflows." },
  { title: "Custom software", body: "Internal tools, admin panels and business systems tailored to real processes." },
  { title: "Integrations", body: "Connecting payment, CRM, inventory and accounting systems with clear data flow." },
  { title: "Project rescue", body: "Auditing and taking over stalled, buggy or undocumented projects." },
  { title: "SEO & growth", body: "Technical SEO, performance and conversion improvements after launch." },
  { title: "Maintenance", body: "Monitoring, updates and a predictable support relationship." },
];

function Page() {
  return (
    <Section>
      <Container>
        <Eyebrow>Services</Eyebrow>
        <h1 className="mt-5 text-[2rem] leading-[1.25] font-bold sm:text-[2.6rem]">
          What we do
        </h1>
        <Lead className="max-w-2xl">
          Every engagement starts with the problem, not the technology stack. The tools are chosen
          after the requirements are clear.
        </Lead>
        <div className="mt-10 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <article key={s.title} className="bg-background p-7">
              <h2 className="text-base font-bold">{s.title}</h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{s.body}</p>
            </article>
          ))}
        </div>
        <p className="mt-8 text-sm text-muted-foreground">
          Detailed service pages are published in Persian at{" "}
          <Link to="/services" className="font-semibold text-brand hover:underline">
            /services
          </Link>
          .
        </p>
      </Container>
    </Section>
  );
}
