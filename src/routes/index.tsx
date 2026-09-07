import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/home/hero";
import {
  BlogSection,
  CapabilityStrip,
  FaqSection,
  FinalCta,
  IndustriesSection,
  PathSelector,
  PaymentSection,
  ProcessSection,
  ProjectRescue,
  SelectedProjects,
  ServicesEditorial,
  SolutionExplorer,
  WhyRycode,
} from "@/components/home/sections";

const title = "RYCODE | رای‌کد — توسعه نرم‌افزار، طراحی سایت و رشد دیجیتال";
const description =
  "رای‌کد شریک فنی کسب‌وکارها برای طراحی سایت، فروشگاه اینترنتی، نرم‌افزار اختصاصی، یکپارچه‌سازی و سئو؛ از ایده تا اجرا و از مشکل تا راه‌حل.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <>
      <Hero />
      <CapabilityStrip />
      <PathSelector />
      <ServicesEditorial />
      <SolutionExplorer />
      <ProjectRescue />
      <SelectedProjects />
      <IndustriesSection />
      <WhyRycode />
      <ProcessSection />
      <PaymentSection />
      <BlogSection />
      <FaqSection />
      <FinalCta />
    </>
  );
}
