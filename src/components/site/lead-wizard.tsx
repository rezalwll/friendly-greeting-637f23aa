import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2, Upload } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { CtaLink } from "@/components/site/primitives";
import { trackEvent, type InternalEvent } from "@/lib/workspace/analytics";
import { cn } from "@/lib/utils";

type LeadType = Database["public"]["Enums"]["lead_type"];

export type WizardField =
  | { name: string; label: string; type: "choice"; options: string[]; required?: boolean; multi?: boolean }
  | { name: string; label: string; type: "text"; placeholder?: string; required?: boolean; dir?: "ltr" | "rtl" }
  | { name: string; label: string; type: "textarea"; placeholder?: string; required?: boolean }
  | { name: string; label: string; type: "checkbox" }
  | { name: string; label: string; type: "upload-placeholder"; note: string };

export type WizardStep = {
  title: string;
  hint?: string;
  fields: WizardField[];
};

/**
 * Multi-step public lead flow.
 *
 * Storage boundary: only the existing `leads` columns are written. Every extra
 * answer is appended to `summary` as a readable block, so no schema change is
 * required and nothing is lost for the internal team.
 */
export function LeadWizard({
  leadType,
  steps,
  startedEvent,
  completedEvent,
  submitLabel,
  successTitle,
  successBody,
  serviceField,
  budgetField,
}: {
  leadType: LeadType;
  steps: WizardStep[];
  startedEvent: InternalEvent;
  completedEvent: InternalEvent;
  submitLabel: string;
  successTitle: string;
  successBody?: string;
  /** Field name whose answer maps to leads.service */
  serviceField?: string;
  /** Field name whose answer maps to leads.budget */
  budgetField?: string;
}) {
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<Record<string, string | string[] | boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">("idle");
  const [started, setStarted] = useState(false);

  const current = steps[step]!;
  const isLast = step === steps.length - 1;
  const progress = useMemo(() => ((step + 1) / steps.length) * 100, [step, steps.length]);

  function update(name: string, value: string | string[] | boolean) {
    setValues((p) => ({ ...p, [name]: value }));
    setErrors((p) => {
      const { [name]: _drop, ...rest } = p;
      return rest;
    });
    if (!started) {
      setStarted(true);
      void trackEvent(startedEvent, { pageType: "marketing" });
    }
  }

  function asText(name: string): string {
    const v = values[name];
    if (Array.isArray(v)) return v.join("، ");
    if (typeof v === "boolean") return v ? "بله" : "";
    return (v ?? "").toString().trim();
  }

  function validateStep() {
    const next: Record<string, string> = {};
    for (const f of current.fields) {
      if (f.type === "checkbox" || f.type === "upload-placeholder") continue;
      if (!f.required) continue;
      const v = asText(f.name);
      if (!v) next[f.name] = "این مورد لازم است.";
      else if (f.name === "phone" && !/^0\d{10}$/.test(v))
        next[f.name] = "شماره تماس ۱۱ رقمی و با ۰ شروع شود.";
      else if (f.name === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v))
        next[f.name] = "ایمیل معتبر نیست.";
      else if (f.type === "textarea" && v.length < 10)
        next[f.name] = "کمی بیشتر توضیح دهید (حداقل ۱۰ نویسه).";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function buildSummary() {
    const lines: string[] = [];
    for (const s of steps) {
      for (const f of s.fields) {
        if (f.type === "upload-placeholder") continue;
        if (["name", "company", "phone", "email"].includes(f.name)) continue;
        const v = asText(f.name);
        if (v) lines.push(`${f.label}: ${v}`);
      }
    }
    return lines.join("\n");
  }

  async function submit() {
    if (status === "saving") return;
    if (!validateStep()) return;
    setStatus("saving");
    const { error } = await supabase.from("leads").insert({
      name: asText("name"),
      company: asText("company") || null,
      phone: asText("phone") || null,
      email: asText("email") || null,
      service: (serviceField ? asText(serviceField) : "") || null,
      budget: (budgetField ? asText(budgetField) : "") || null,
      summary: buildSummary() || null,
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
      <div role="status" className="rounded-lg border border-brand/40 bg-brand/5 p-10 text-center">
        <CheckCircle2 aria-hidden className="mx-auto size-9 text-brand" />
        <p className="mt-5 text-lg font-bold">{successTitle}</p>
        <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-muted-foreground">
          {successBody ??
            "درخواست شما در سامانه داخلی رای‌کد ثبت شد. کارشناس ما در اولین فرصت کاری تماس می‌گیرد."}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <CtaLink to="/process" variant="outline">
            فرآیند کار را ببینید
          </CtaLink>
          <CtaLink to="/blog" variant="outline">
            مطالعه بلاگ
          </CtaLink>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Stepper */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            گام {step + 1} از {steps.length}
          </span>
          <span>{current.title}</span>
        </div>
        <div
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={steps.length}
          aria-valuenow={step + 1}
          className="mt-3 h-1 w-full overflow-hidden rounded-full bg-secondary"
        >
          <div className="h-full bg-brand transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          if (isLast) void submit();
          else if (validateStep()) setStep((s) => s + 1);
        }}
      >
        <fieldset disabled={status === "saving"} className="border-0 p-0">
          <legend className="text-xl font-bold">{current.title}</legend>
          {current.hint && (
            <p className="mt-2 text-sm leading-7 text-muted-foreground">{current.hint}</p>
          )}

          <div className="mt-7 grid gap-6">
            {current.fields.map((f) => {
              const id = `wz-${f.name}`;
              const error = errors[f.name];
              if (f.type === "choice") {
                const selected = values[f.name];
                const list = Array.isArray(selected) ? selected : selected ? [String(selected)] : [];
                return (
                  <fieldset key={f.name} className="border-0 p-0">
                    <legend className="text-sm font-semibold">
                      {f.label}
                      {f.required && <span className="text-brand"> *</span>}
                    </legend>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {f.options.map((opt) => {
                        const active = list.includes(opt);
                        return (
                          <button
                            key={opt}
                            type="button"
                            aria-pressed={active}
                            onClick={() =>
                              update(
                                f.name,
                                f.multi
                                  ? active
                                    ? list.filter((x) => x !== opt)
                                    : [...list, opt]
                                  : opt,
                              )
                            }
                            className={cn(
                              "rounded-full border px-4 py-2 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
                              active
                                ? "border-brand bg-brand/10 font-semibold text-foreground"
                                : "border-border text-muted-foreground hover:border-foreground/40",
                            )}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                    {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
                  </fieldset>
                );
              }
              if (f.type === "checkbox") {
                return (
                  <label key={f.name} htmlFor={id} className="flex items-start gap-3 text-sm">
                    <input
                      id={id}
                      type="checkbox"
                      checked={values[f.name] === true}
                      onChange={(e) => update(f.name, e.target.checked)}
                      className="mt-1 size-4 accent-[var(--color-brand)]"
                    />
                    <span className="leading-7">{f.label}</span>
                  </label>
                );
              }
              if (f.type === "upload-placeholder") {
                return (
                  <div
                    key={f.name}
                    className="rounded-lg border border-dashed border-border bg-secondary/40 p-6"
                  >
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <Upload aria-hidden className="size-4 text-brand" />
                      {f.label}
                    </div>
                    <p className="mt-2 text-xs leading-6 text-muted-foreground">{f.note}</p>
                  </div>
                );
              }
              return (
                <div key={f.name} className="flex flex-col gap-2">
                  <label htmlFor={id} className="text-sm font-semibold">
                    {f.label}
                    {f.required && <span className="text-brand"> *</span>}
                  </label>
                  {f.type === "textarea" ? (
                    <textarea
                      id={id}
                      rows={5}
                      placeholder={f.placeholder}
                      value={(values[f.name] as string) ?? ""}
                      onChange={(e) => update(f.name, e.target.value)}
                      aria-invalid={Boolean(error)}
                      aria-describedby={error ? `${id}-error` : undefined}
                      className="w-full rounded-md border border-border bg-background px-3 py-3 text-sm leading-7 outline-none focus-visible:border-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                    />
                  ) : (
                    <input
                      id={id}
                      type={f.name === "email" ? "email" : f.name === "phone" ? "tel" : "text"}
                      inputMode={f.name === "phone" ? "numeric" : undefined}
                      dir={f.dir}
                      placeholder={f.placeholder}
                      value={(values[f.name] as string) ?? ""}
                      onChange={(e) => update(f.name, e.target.value)}
                      aria-invalid={Boolean(error)}
                      aria-describedby={error ? `${id}-error` : undefined}
                      className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus-visible:border-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
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
          </div>

          {status === "error" && (
            <p role="alert" className="mt-6 text-sm text-destructive">
              ثبت درخواست انجام نشد. لطفاً دوباره تلاش کنید.
            </p>
          )}

          <div className="mt-9 flex flex-wrap items-center gap-3 border-t border-border pt-7">
            {step > 0 && (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                className="inline-flex h-11 items-center gap-2 rounded-md border border-border px-5 text-sm font-semibold hover:bg-secondary"
              >
                <ArrowRight aria-hidden className="size-4" />
                مرحله قبل
              </button>
            )}
            <button
              type="submit"
              className="inline-flex h-11 items-center gap-2 rounded-md bg-brand px-7 text-sm font-semibold text-brand-foreground transition-colors hover:bg-brand/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:opacity-60"
            >
              {status === "saving" && <Loader2 aria-hidden className="size-4 animate-spin" />}
              {status === "saving" ? "در حال ثبت…" : isLast ? submitLabel : "مرحله بعد"}
              {!isLast && <ArrowLeft aria-hidden className="size-4" />}
            </button>
          </div>
          <p className="mt-4 text-xs leading-6 text-muted-foreground">
            اطلاعات فقط در پایگاه‌داده داخلی رای‌کد ذخیره می‌شود؛ هیچ سرویس بیرونی در این مسیر نیست.
          </p>
        </fieldset>
      </form>
    </div>
  );
}
