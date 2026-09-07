import { useEffect, useRef, useState } from "react";
import { Container, CtaLink, MetaLabel, TextLink } from "@/components/site/primitives";

export function Hero() {
  return (
    <section className="grain relative flex min-h-[82vh] flex-col justify-between overflow-hidden border-b border-border pt-16 pb-10 sm:pt-24">
      <BrandField />

      <Container className="relative">
        <div className="flex items-center justify-between gap-6 border-b border-hairline pb-5">
          <MetaLabel index={1}>RYCODE / SOFTWARE ENGINEERING</MetaLabel>
          <MetaLabel className="hidden text-muted-foreground sm:inline-flex">
            BUILD / RESCUE / GROW
          </MetaLabel>
        </div>
      </Container>

      <Container className="relative py-14 sm:py-20">
        <h1 className="display-1 reveal max-w-[16ch]">
          از ایده تا اجرا؛
          <br />
          از مشکل تا <span className="text-brand">راه‌حل</span>.
        </h1>
      </Container>

      <Container className="relative">
        <div className="grid gap-10 border-t border-hairline pt-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <p className="max-w-xl text-lg leading-9 text-muted-foreground">
            رای‌کد شریک فنی کسب‌وکارهاست: طراحی و توسعه وب، فروشگاه اینترنتی، نرم‌افزار اختصاصی،
            یکپارچه‌سازی سیستم‌ها و سئو. از همان نقطه‌ای که هستید شروع می‌کنیم.
          </p>
          <div className="flex flex-col gap-6 lg:items-end">
            <div className="flex flex-wrap items-center gap-3">
              <CtaLink to="/start-project">شروع پروژه</CtaLink>
              <CtaLink to="/services" variant="outline">
                مشاهده خدمات
              </CtaLink>
            </div>
            <TextLink to="/technical-review">پروژه‌ای دارید که به مشکل خورده؟</TextLink>
          </div>
        </div>
      </Container>
    </section>
  );
}

/**
 * Signature interaction: abstract planes derived from the RYCODE mark geometry
 * drift a few pixels with the pointer. Restrained, disabled for reduced motion.
 */
function BrandField() {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const onMove = (e: PointerEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setOffset({ x, y });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <div ref={ref} aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="grid-field absolute inset-0 opacity-50 [mask-image:radial-gradient(80%_70%_at_80%_0%,black,transparent)]" />

      <div
        className="absolute top-[12%] left-[-6%] hidden h-[52vh] w-[26vw] border border-hairline lg:block"
        style={{ transform: `translate3d(${offset.x * 8}px, ${offset.y * 8}px, 0)` }}
      />
      <div
        className="absolute top-[34%] left-[3%] hidden h-20 w-20 bg-brand lg:block"
        style={{ transform: `translate3d(${offset.x * -14}px, ${offset.y * -10}px, 0)` }}
      />
      <div
        className="absolute top-[18%] left-[12%] hidden h-36 w-36 border border-foreground/30 lg:block"
        style={{ transform: `translate3d(${offset.x * -6}px, ${offset.y * 12}px, 0)` }}
      />
      <div
        className="absolute top-1/3 left-[3%] hidden h-px w-[22vw] bg-foreground/20 lg:block"
        style={{ transform: `translate3d(${offset.x * 16}px, 0, 0)` }}
      />
    </div>
  );
}
