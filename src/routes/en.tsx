import { createFileRoute, Link, Outlet } from "@tanstack/react-router";

import { Container } from "@/components/site/primitives";

export const Route = createFileRoute("/en")({
  component: EnglishLayout,
});

const nav = [
  { to: "/en", label: "Home", exact: true },
  { to: "/en/services", label: "Services", exact: false },
  { to: "/en/about", label: "About", exact: false },
  { to: "/en/contact", label: "Contact", exact: false },
] as const;

function EnglishLayout() {
  return (
    <div dir="ltr" lang="en" className="text-start">
      <div className="border-b border-border bg-surface">
        <Container className="flex flex-wrap items-center justify-between gap-4 py-4">
          <nav aria-label="English navigation" className="flex flex-wrap gap-5 text-sm">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                activeOptions={{ exact: n.exact }}
                activeProps={{ className: "font-bold text-brand" }}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <Link to="/" className="text-xs font-semibold text-brand hover:underline">
            نسخه فارسی
          </Link>
        </Container>
      </div>
      <Outlet />
    </div>
  );
}
