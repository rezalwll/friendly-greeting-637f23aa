import { Link } from "@tanstack/react-router";
import { Container, MetaLabel } from "./primitives";
import { footerNav } from "@/lib/nav-content";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/12 bg-ink text-ink-foreground">
      <Container className="pt-16 pb-10">
        <div
          dir="ltr"
          className="flex items-end justify-between gap-6 border-b border-white/12 pb-10"
        >
          <span className="text-[clamp(3rem,13vw,11rem)] leading-[0.85] font-extrabold tracking-[-0.04em]">
            <span className="text-ink-foreground">RY</span>
            <span className="text-brand">CODE</span>
          </span>
          <MetaLabel className="hidden text-white/45 sm:inline-flex">rycode.ir</MetaLabel>
        </div>

        <div className="grid gap-12 py-14 lg:grid-cols-[1fr_2.2fr]">
          <p className="max-w-sm text-sm leading-8 text-ink-foreground/65">
            رای‌کد شریک فنی کسب‌وکارها برای ساخت، توسعه و رشد محصولات دیجیتال است؛ از طراحی سایت و
            فروشگاه اینترنتی تا نرم‌افزار اختصاصی، یکپارچه‌سازی و سئو.
          </p>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
            {footerNav.map((group) => (
              <div key={group.title}>
                <MetaLabel className="text-brand">{group.title}</MetaLabel>
                <ul className="mt-5 space-y-3">
                  {group.items.map((item) => (
                    <li key={item.label}>
                      <Link
                        to={item.href}
                        className="text-sm text-ink-foreground/65 transition-colors hover:text-ink-foreground"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/12 pt-6 text-xs text-ink-foreground/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} RYCODE — تمام حقوق محفوظ است.</p>
          <p>ساخته‌شده در ایران</p>
        </div>
      </Container>
    </footer>
  );
}
