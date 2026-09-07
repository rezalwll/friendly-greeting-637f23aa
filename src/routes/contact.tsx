import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";

import { Breadcrumbs, PageHeader, PageShell } from "@/components/site/collection";
import { supabase } from "@/integrations/supabase/client";
import { trackEvent } from "@/lib/workspace/analytics";
import { cn } from "@/lib/utils";

const title = "تماس با رای‌کد | مشاوره پروژه و پشتیبانی";
const description = "راه‌های ارتباط با تیم رای‌کد و فرم پیام مستقیم؛ پاسخ در ساعات کاری.";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

const inputClass =
  "h-11 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus-visible:border-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:opacity-60";

function Page() {
  const [values, setValues] = useState({ name: "", email: "", phone: "", subject: "", body: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">("idle");

  function set(key: keyof typeof values, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (status === "saving") return;
    const next: Record<string, string> = {};
    if (!values.name.trim()) next["name"] = "نام را وارد کنید.";
    if (values.body.trim().length < 10) next["body"] = "متن پیام حداقل ۱۰ نویسه باشد.";
    if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      next["email"] = "ایمیل معتبر نیست.";
    }
    setErrors(next);
    if (Object.keys(next).length) return;

    setStatus("saving");
    const { error } = await supabase.from("contact_messages").insert({
      name: values.name.trim(),
      email: values.email.trim() || null,
      phone: values.phone.trim() || null,
      subject: values.subject.trim() || null,
      body: values.body.trim(),
    });
    if (error) {
      setStatus("error");
      return;
    }
    void trackEvent("contact_click", { pageType: "marketing", label: "contact_form" });
    setStatus("done");
  }

  return (
    <PageShell>
      <div className="mx-auto max-w-3xl">
        <Breadcrumbs items={[{ label: "تماس" }]} />
        <PageHeader
          eyebrow="تماس"
          title="با رای‌کد در تماس باشید"
          lead="پیام شما در سامانه داخلی ثبت می‌شود و در بخش پشتیبانی پیگیری خواهد شد."
        />

        {status === "done" ? (
          <div role="status" className="mt-10 rounded-lg border border-brand/40 bg-brand/5 p-8 text-center">
            <CheckCircle2 aria-hidden className="mx-auto size-8 text-brand" />
            <p className="mt-4 text-base font-bold">پیام شما ثبت شد</p>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              در اولین فرصت کاری پاسخ می‌دهیم.
            </p>
          </div>
        ) : (
          <form onSubmit={onSubmit} noValidate className="mt-10 grid gap-5 sm:grid-cols-2">
            {(
              [
                ["name", "نام و نام خانوادگی", true],
                ["phone", "شماره تماس", false],
                ["email", "ایمیل", false],
                ["subject", "موضوع", false],
              ] as const
            ).map(([key, label, required]) => (
              <div key={key} className="flex flex-col gap-2">
                <label htmlFor={`c-${key}`} className="text-sm font-semibold">
                  {label}
                  {required && <span className="text-brand"> *</span>}
                </label>
                <input
                  id={`c-${key}`}
                  type={key === "email" ? "email" : key === "phone" ? "tel" : "text"}
                  dir={key === "email" ? "ltr" : undefined}
                  value={values[key]}
                  onChange={(e) => set(key, e.target.value)}
                  disabled={status === "saving"}
                  aria-invalid={Boolean(errors[key])}
                  aria-describedby={errors[key] ? `c-${key}-error` : undefined}
                  className={inputClass}
                />
                {errors[key] && (
                  <p id={`c-${key}-error`} className="text-xs text-destructive">
                    {errors[key]}
                  </p>
                )}
              </div>
            ))}

            <div className="flex flex-col gap-2 sm:col-span-2">
              <label htmlFor="c-body" className="text-sm font-semibold">
                پیام<span className="text-brand"> *</span>
              </label>
              <textarea
                id="c-body"
                rows={6}
                value={values.body}
                onChange={(e) => set("body", e.target.value)}
                disabled={status === "saving"}
                aria-invalid={Boolean(errors["body"])}
                aria-describedby={errors["body"] ? "c-body-error" : undefined}
                className={cn(inputClass, "h-auto py-3 leading-7")}
              />
              {errors["body"] && (
                <p id="c-body-error" className="text-xs text-destructive">
                  {errors["body"]}
                </p>
              )}
            </div>

            {status === "error" && (
              <p role="alert" className="sm:col-span-2 text-sm text-destructive">
                ارسال پیام انجام نشد. دوباره تلاش کنید.
              </p>
            )}

            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={status === "saving"}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-brand px-7 text-sm font-semibold text-brand-foreground hover:bg-brand/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:opacity-60"
              >
                {status === "saving" && <Loader2 aria-hidden className="size-4 animate-spin" />}
                {status === "saving" ? "در حال ارسال…" : "ارسال پیام"}
              </button>
            </div>
          </form>
        )}
      </div>
    </PageShell>
  );
}
