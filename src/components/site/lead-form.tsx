import { useState, type FormEvent } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { trackEvent, type InternalEvent } from "@/lib/workspace/analytics";
import { cn } from "@/lib/utils";

type LeadType = Database["public"]["Enums"]["lead_type"];

export type LeadFieldName = "name" | "company" | "phone" | "email" | "service" | "budget" | "summary";

const fieldLabels: Record<LeadFieldName, string> = {
  name: "نام و نام خانوادگی",
  company: "نام کسب‌وکار",
  phone: "شماره تماس",
  email: "ایمیل",
  service: "موضوع درخواست",
  budget: "بازه بودجه",
  summary: "توضیح کوتاه",
};

const inputClass =
  "h-11 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus-visible:border-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:opacity-60";

export function LeadForm({
  leadType,
  fields,
  startedEvent,
  completedEvent,
  submitLabel,
  successTitle,
}: {
  leadType: LeadType;
  fields: LeadFieldName[];
  startedEvent: InternalEvent;
  completedEvent: InternalEvent;
  submitLabel: string;
  successTitle: string;
}) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">("idle");
  const [started, setStarted] = useState(false);

  function update(name: string, value: string) {
    setValues((prev) => ({ ...prev, [name]: value }));
    if (!started) {
      setStarted(true);
      void trackEvent(startedEvent, { pageType: "marketing" });
    }
  }

  function validate() {
    const next: Record<string, string> = {};
    if (!(values["name"] ?? "").trim()) next["name"] = "نام را وارد کنید.";
    const phone = (values["phone"] ?? "").trim();
    if (fields.includes("phone") && !/^0\d{10}$/.test(phone)) {
      next["phone"] = "شماره تماس ۱۱ رقمی و با ۰ شروع شود.";
    }
    const email = (values["email"] ?? "").trim();
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      next["email"] = "ایمیل معتبر نیست.";
    }
    if (fields.includes("summary") && (values["summary"] ?? "").trim().length < 10) {
      next["summary"] = "کمی بیشتر توضیح دهید (حداقل ۱۰ نویسه).";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (status === "saving") return; // guards double submission
    if (!validate()) return;
    setStatus("saving");
    const { error } = await supabase.from("leads").insert({
      name: (values["name"] ?? "").trim(),
      company: values["company"]?.trim() || null,
      phone: values["phone"]?.trim() || null,
      email: values["email"]?.trim() || null,
      service: values["service"]?.trim() || null,
      budget: values["budget"]?.trim() || null,
      summary: values["summary"]?.trim() || null,
      lead_type: leadType,
      landing_page: typeof window === "undefined" ? null : window.location.pathname,
      source: "website",
    });
    if (error) {
      setStatus("error");
      return;
    }
    void trackEvent(completedEvent, { pageType: "marketing" });
    setStatus("done");
  }

  if (status === "done") {
    return (
      <div
        role="status"
        className="rounded-lg border border-brand/40 bg-brand/5 p-8 text-center"
      >
        <CheckCircle2 aria-hidden className="mx-auto size-8 text-brand" />
        <p className="mt-4 text-base font-bold">{successTitle}</p>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          درخواست شما در سامانه داخلی رای‌کد ثبت شد. کارشناس ما در اولین فرصت کاری تماس می‌گیرد.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-5 sm:grid-cols-2">
      {fields.map((field) => {
        const isWide = field === "summary";
        const id = `lead-${field}`;
        const error = errors[field];
        return (
          <div key={field} className={cn("flex flex-col gap-2", isWide && "sm:col-span-2")}>
            <label htmlFor={id} className="text-sm font-semibold">
              {fieldLabels[field]}
              {(field === "name" || field === "phone" || field === "summary") && (
                <span className="text-brand"> *</span>
              )}
            </label>
            {isWide ? (
              <textarea
                id={id}
                rows={5}
                value={values[field] ?? ""}
                onChange={(e) => update(field, e.target.value)}
                disabled={status === "saving"}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? `${id}-error` : undefined}
                className={cn(inputClass, "h-auto py-3 leading-7")}
              />
            ) : (
              <input
                id={id}
                type={field === "email" ? "email" : field === "phone" ? "tel" : "text"}
                inputMode={field === "phone" ? "numeric" : undefined}
                dir={field === "email" ? "ltr" : undefined}
                value={values[field] ?? ""}
                onChange={(e) => update(field, e.target.value)}
                disabled={status === "saving"}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? `${id}-error` : undefined}
                className={inputClass}
              />
            )}
            {error && (
              <p id={`${id}-error`} className="text-xs text-destructive">
                {error}
              </p>
            )}
          </div>
        );
      })}

      {status === "error" && (
        <p role="alert" className="sm:col-span-2 text-sm text-destructive">
          ثبت درخواست انجام نشد. لطفاً دوباره تلاش کنید.
        </p>
      )}

      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={status === "saving"}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-brand px-7 text-sm font-semibold text-brand-foreground transition-colors hover:bg-brand/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:opacity-60"
        >
          {status === "saving" && <Loader2 aria-hidden className="size-4 animate-spin" />}
          {status === "saving" ? "در حال ثبت…" : submitLabel}
        </button>
        <p className="mt-3 text-xs text-muted-foreground">
          اطلاعات فقط در پایگاه‌داده داخلی رای‌کد ذخیره می‌شود؛ هیچ سرویس بیرونی در این مسیر نیست.
        </p>
      </div>
    </form>
  );
}
