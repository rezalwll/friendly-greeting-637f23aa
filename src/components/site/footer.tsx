import { Link } from "@tanstack/react-router";
import { Logo } from "./logo";
import { Container } from "./primitives";
import { footerNav } from "@/lib/nav-content";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface">
      <Container className="py-16">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_2.4fr]">
          <div>
            <Logo className="text-2xl" />
            <p className="mt-5 max-w-sm text-sm leading-7 text-muted-foreground">
              رای‌کد شریک فنی کسب‌وکارها برای ساخت، توسعه و رشد محصولات دیجیتال است؛ از طراحی سایت و
              فروشگاه اینترنتی تا نرم‌افزار اختصاصی، یکپارچه‌سازی و سئو.
            </p>
            <p className="mt-6 text-xs text-muted-foreground" dir="ltr">
              rycode.ir
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {footerNav.map((group) => (
              <div key={group.title}>
                <p className="text-xs font-bold tracking-[0.12em] text-brand uppercase">
                  {group.title}
                </p>
                <ul className="mt-4 space-y-2.5">
                  {group.items.map((item) => (
                    <li key={item.label}>
                      <Link
                        to={item.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
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

        <div className="mt-14 flex flex-col gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} RYCODE — تمام حقوق محفوظ است.</p>
          <p>ساخته‌شده در ایران</p>
        </div>
      </Container>
    </footer>
  );
}
