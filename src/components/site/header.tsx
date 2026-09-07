import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ChevronDown, Globe, Menu, X } from "lucide-react";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";
import { Container, CtaLink } from "./primitives";
import { cn } from "@/lib/utils";
import {
  industries,
  primaryNav,
  serviceGroups,
  solutionGroups,
  type NavGroup,
} from "@/lib/nav-content";

type MenuKey = "services" | "solutions" | "industries" | null;

export function SiteHeader() {
  const [open, setOpen] = useState<MenuKey>(null);
  const [mobile, setMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobile ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobile]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-colors",
        scrolled ? "border-border bg-background/85 backdrop-blur-md" : "border-transparent",
      )}
      onMouseLeave={() => setOpen(null)}
    >
      <Container className="flex h-[72px] items-center justify-between gap-6">
        <div className="flex items-center gap-8">
          <Link to="/" aria-label="RYCODE" className="shrink-0">
            <Logo />
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {primaryNav.map((item) => {
              const key: MenuKey =
                item.href === "/services"
                  ? "services"
                  : item.href === "/solutions"
                    ? "solutions"
                    : item.href === "/industries"
                      ? "industries"
                      : null;
              return (
                <div key={item.href} onMouseEnter={() => setOpen(key)}>
                  <Link
                    to={item.href}
                    className="inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
                    activeProps={{ className: "text-foreground" }}
                  >
                    {item.label}
                    {key && (
                      <ChevronDown
                        className={cn(
                          "size-3.5 transition-transform",
                          open === key && "rotate-180",
                        )}
                      />
                    )}
                  </Link>
                </div>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="hidden items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground md:inline-flex"
            aria-label="تغییر زبان"
          >
            <Globe className="size-3.5" />
            FA / EN
          </button>
          <ThemeToggle className="hidden md:inline-flex" />
          <Link
            to="/login"
            className="hidden px-3 text-sm font-medium text-foreground/80 hover:text-foreground md:inline-flex"
          >
            ورود مشتری
          </Link>
          <CtaLink to="/start-project" className="hidden h-10 px-5 sm:inline-flex">
            شروع پروژه
          </CtaLink>
          <button
            type="button"
            onClick={() => setMobile(true)}
            aria-label="منو"
            className="grid size-10 place-items-center rounded-md border border-border lg:hidden"
          >
            <Menu className="size-5" />
          </button>
        </div>
      </Container>

      {open && (
        <div className="absolute inset-x-0 top-full hidden border-y border-border bg-surface lg:block">
          <Container className="py-10">
            {open === "services" && <MegaColumns groups={serviceGroups} />}
            {open === "solutions" && <MegaColumns groups={solutionGroups} />}
            {open === "industries" && (
              <div className="grid grid-cols-4 gap-x-8 gap-y-3">
                {industries.map((name) => (
                  <Link
                    key={name}
                    to="/industries"
                    className="rule-top py-3 text-sm text-foreground/80 transition-colors hover:text-brand"
                  >
                    {name}
                  </Link>
                ))}
              </div>
            )}
          </Container>
        </div>
      )}

      {mobile && <MobileNav onClose={() => setMobile(false)} />}
    </header>
  );
}

function MegaColumns({ groups }: { groups: NavGroup[] }) {
  return (
    <div className="grid grid-cols-5 gap-8">
      {groups.map((group) => (
        <div key={group.title}>
          <p className="text-xs font-bold tracking-[0.12em] text-brand uppercase">{group.title}</p>
          <ul className="mt-4 space-y-2.5">
            {group.items.map((item) => (
              <li key={item.label}>
                <Link
                  to={item.href}
                  className="text-sm text-foreground/75 transition-colors hover:text-foreground"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function MobileNav({ onClose }: { onClose: () => void }) {
  const [section, setSection] = useState<string | null>(null);

  const drawers: { key: string; label: string; groups: NavGroup[] }[] = [
    { key: "services", label: "خدمات", groups: serviceGroups },
    { key: "solutions", label: "راهکارها", groups: solutionGroups },
  ];

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background lg:hidden">
      <div className="flex h-[72px] shrink-0 items-center justify-between border-b border-border px-5">
        <Logo />
        <button
          type="button"
          onClick={onClose}
          aria-label="بستن"
          className="grid size-10 place-items-center rounded-md border border-border"
        >
          <X className="size-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-6">
        {drawers.map((d) => (
          <div key={d.key} className="border-b border-border">
            <button
              type="button"
              onClick={() => setSection(section === d.key ? null : d.key)}
              className="flex w-full items-center justify-between py-4 text-start text-lg font-semibold"
            >
              {d.label}
              <ChevronDown
                className={cn("size-4 transition-transform", section === d.key && "rotate-180")}
              />
            </button>
            {section === d.key && (
              <div className="pb-4">
                {d.groups.map((g) => (
                  <div key={g.title} className="mb-4">
                    <p className="text-xs font-bold tracking-[0.12em] text-brand uppercase">
                      {g.title}
                    </p>
                    <ul className="mt-2 space-y-2">
                      {g.items.map((i) => (
                        <li key={i.label}>
                          <Link
                            to={i.href}
                            onClick={onClose}
                            className="block text-sm text-muted-foreground"
                          >
                            {i.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {primaryNav
          .filter((i) => i.href !== "/services" && i.href !== "/solutions")
          .map((i) => (
            <Link
              key={i.href}
              to={i.href}
              onClick={onClose}
              className="block border-b border-border py-4 text-lg font-semibold"
            >
              {i.label}
            </Link>
          ))}
      </div>

      <div className="shrink-0 space-y-3 border-t border-border px-5 py-5">
        <CtaLink to="/start-project" className="w-full">
          شروع پروژه
        </CtaLink>
        <CtaLink to="/technical-review" variant="outline" className="w-full">
          درخواست بررسی فنی
        </CtaLink>
        <div className="flex items-center justify-between pt-2">
          <ThemeToggle />
          <Link to="/login" onClick={onClose} className="text-sm font-medium">
            ورود مشتری
          </Link>
        </div>
      </div>
    </div>
  );
}
