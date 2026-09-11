"use client";

import { Check, LoaderCircle } from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";

import { submitLeadAction, type LeadActionState } from "@/features/leads/actions";
import {
  readAnalyticsAttribution,
  subscribeAnalyticsAttribution,
  trackAnalyticsEvent,
  type AnalyticsAttribution,
} from "@/components/analytics/analytics-provider";
import type { LeadKind } from "@/features/leads/schema";
import type { Locale } from "@/i18n/routing";

const initialState: LeadActionState = { status: "idle", message: "" };

type Copy = {
  name: string;
  email: string;
  phone: string;
  company: string;
  website: string;
  projectType: string;
  budget: string;
  timeline: string;
  message: string;
  consent: string;
  submit: string;
  sending: string;
  optional: string;
  choose: string;
  contactHint: string;
};

const copy: Record<Locale, Copy> = {
  fa: {
    name: "نام و نام خانوادگی",
    email: "ایمیل",
    phone: "شماره تماس",
    company: "نام شرکت یا مجموعه",
    website: "نشانی وب‌سایت",
    projectType: "نوع پروژه یا فناوری فعلی",
    budget: "بازه تقریبی بودجه",
    timeline: "زمان مطلوب شروع",
    message: "مسئله، وضعیت فعلی و نتیجه‌ای که انتظار دارید",
    consent: "با ثبت این فرم موافقم رای‌کد برای پیگیری همین درخواست با من تماس بگیرد.",
    submit: "ثبت امن درخواست",
    sending: "در حال ثبت…",
    optional: "اختیاری",
    choose: "انتخاب کنید",
    contactHint: "حداقل یکی از ایمیل یا شماره تماس الزامی است.",
  },
  en: {
    name: "Full name",
    email: "Email",
    phone: "Phone",
    company: "Company or organisation",
    website: "Website URL",
    projectType: "Project type or current technology",
    budget: "Indicative budget",
    timeline: "Preferred start",
    message: "The problem, current state and outcome you need",
    consent: "I agree that RYCODE may contact me solely to follow up this request.",
    submit: "Submit request securely",
    sending: "Submitting…",
    optional: "Optional",
    choose: "Choose one",
    contactHint: "At least one of email or phone is required.",
  },
};

const budgetOptions: Record<Locale, string[]> = {
  fa: [
    "نیازمند برآورد",
    "کمتر از ۱۰۰ میلیون تومان",
    "۱۰۰ تا ۳۰۰ میلیون تومان",
    "۳۰۰ تا ۷۰۰ میلیون تومان",
    "بیشتر از ۷۰۰ میلیون تومان",
  ],
  en: [
    "Needs assessment",
    "Small engagement",
    "Mid-size engagement",
    "Large engagement",
    "Enterprise / phased programme",
  ],
};

const timelineOptions: Record<Locale, string[]> = {
  fa: ["فوری؛ پس از بررسی ریسک", "یک ماه آینده", "یک تا سه ماه آینده", "زمان انعطاف‌پذیر"],
  en: [
    "Urgent, subject to risk review",
    "Within one month",
    "Within one to three months",
    "Flexible",
  ],
};

function FieldError({ state, name }: { state: LeadActionState; name: string }) {
  const error = state.fieldErrors?.[name]?.[0];
  if (!error) return null;
  return (
    <span id={`${name}-error`} className="mt-2 block text-xs font-semibold text-destructive">
      {error}
    </span>
  );
}

function SubmitButton({ locale }: { locale: Locale }) {
  const { pending } = useFormStatus();
  const text = copy[locale];
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex min-h-12 items-center justify-center gap-3 rounded-[6px] bg-brand px-7 text-sm font-bold text-brand-foreground transition-colors hover:bg-brand/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-wait disabled:opacity-70"
    >
      {pending && <LoaderCircle className="size-4 animate-spin" aria-hidden />}
      {pending ? text.sending : text.submit}
    </button>
  );
}

const inputClass =
  "mt-2 min-h-12 w-full rounded-[6px] border border-input bg-background px-4 text-base outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-brand focus:ring-2 focus:ring-brand/20";

function labelText(label: string, optional: string, isOptional = false) {
  return (
    <>
      {label}
      {isOptional && (
        <span className="ms-2 text-xs font-normal text-muted-foreground">({optional})</span>
      )}
    </>
  );
}

export function LeadForm({
  locale,
  kind,
  sourcePath,
}: {
  locale: Locale;
  kind: LeadKind;
  sourcePath: string;
}) {
  const [startedAt] = useState(() => Date.now());
  const [attribution, setAttribution] = useState<AnalyticsAttribution | null>(null);
  const [state, formAction] = useActionState(submitLeadAction, initialState);
  const text = copy[locale];
  const detailed = kind !== "contact";
  const needsWebsite = kind === "technical_review" || kind === "seo_audit";

  useEffect(() => {
    const syncAttribution = () => setAttribution(readAnalyticsAttribution());
    syncAttribution();
    return subscribeAnalyticsAttribution(syncAttribution);
  }, []);

  useEffect(() => {
    if (state.status !== "success") return;
    trackAnalyticsEvent({
      name: "form_submitted",
      path: window.location.pathname,
      label: `lead:${kind}`,
    });
  }, [kind, state.status]);

  if (state.status === "success") {
    return (
      <div role="status" className="rounded-[6px] border border-brand/35 bg-brand-soft p-8 sm:p-10">
        <span className="grid size-11 place-items-center rounded-full bg-brand text-brand-foreground">
          <Check className="size-5" aria-hidden />
        </span>
        <h2 className="mt-6 text-xl font-bold">
          {locale === "fa" ? "درخواست ثبت شد" : "Request submitted"}
        </h2>
        <p className="mt-3 max-w-xl leading-8 text-muted-foreground">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-7" noValidate>
      <input type="hidden" name="kind" value={kind} />
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="sourcePath" value={sourcePath} />
      <input type="hidden" name="startedAt" value={startedAt} />
      {attribution && (
        <>
          <input type="hidden" name="analyticsAnonymousId" value={attribution.anonymousId} />
          <input type="hidden" name="analyticsSessionKey" value={attribution.sessionKey} />
        </>
      )}

      <div className="absolute -start-[10000px] top-auto size-px overflow-hidden" aria-hidden>
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {state.status === "error" && (
        <div
          role="alert"
          className="rounded-[6px] border border-destructive/40 bg-destructive/5 p-4 text-sm leading-7 text-destructive"
        >
          {state.message}
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <label className="text-sm font-semibold">
          {text.name}
          <input
            name="fullName"
            type="text"
            required
            minLength={2}
            maxLength={120}
            autoComplete="name"
            aria-invalid={Boolean(state.fieldErrors?.fullName)}
            aria-describedby={state.fieldErrors?.fullName ? "fullName-error" : undefined}
            className={inputClass}
          />
          <FieldError state={state} name="fullName" />
        </label>
        <label className="text-sm font-semibold">
          {labelText(text.company, text.optional, true)}
          <input
            name="company"
            type="text"
            maxLength={160}
            autoComplete="organization"
            className={inputClass}
          />
          <FieldError state={state} name="company" />
        </label>
      </div>

      <div>
        <div className="grid gap-6 sm:grid-cols-2">
          <label className="text-sm font-semibold">
            {text.email}
            <input
              name="email"
              type="email"
              inputMode="email"
              maxLength={254}
              autoComplete="email"
              dir="ltr"
              aria-invalid={Boolean(state.fieldErrors?.email)}
              aria-describedby={
                state.fieldErrors?.email ? "email-error contact-hint" : "contact-hint"
              }
              className={inputClass}
            />
            <FieldError state={state} name="email" />
          </label>
          <label className="text-sm font-semibold">
            {text.phone}
            <input
              name="phone"
              type="tel"
              inputMode="tel"
              maxLength={32}
              autoComplete="tel"
              dir="ltr"
              aria-invalid={Boolean(state.fieldErrors?.phone)}
              aria-describedby={
                state.fieldErrors?.phone ? "phone-error contact-hint" : "contact-hint"
              }
              className={inputClass}
            />
            <FieldError state={state} name="phone" />
          </label>
        </div>
        <p id="contact-hint" className="mt-3 text-xs text-muted-foreground">
          {text.contactHint}
        </p>
      </div>

      {(detailed || needsWebsite) && (
        <div className="grid gap-6 sm:grid-cols-2">
          <label className="text-sm font-semibold">
            {labelText(text.website, text.optional, !needsWebsite)}
            <input
              name="websiteUrl"
              type="url"
              inputMode="url"
              maxLength={500}
              required={needsWebsite}
              placeholder="https://"
              dir="ltr"
              aria-invalid={Boolean(state.fieldErrors?.websiteUrl)}
              aria-describedby={state.fieldErrors?.websiteUrl ? "websiteUrl-error" : undefined}
              className={inputClass}
            />
            <FieldError state={state} name="websiteUrl" />
          </label>
          <label className="text-sm font-semibold">
            {labelText(text.projectType, text.optional, true)}
            <input name="projectType" type="text" maxLength={160} className={inputClass} />
            <FieldError state={state} name="projectType" />
          </label>
        </div>
      )}

      {kind === "project" && (
        <div className="grid gap-6 sm:grid-cols-2">
          <label className="text-sm font-semibold">
            {labelText(text.budget, text.optional, true)}
            <select name="budget" className={inputClass} defaultValue="">
              <option value="">{text.choose}</option>
              {budgetOptions[locale].map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </label>
          <label className="text-sm font-semibold">
            {labelText(text.timeline, text.optional, true)}
            <select name="timeline" className={inputClass} defaultValue="">
              <option value="">{text.choose}</option>
              {timelineOptions[locale].map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </label>
        </div>
      )}

      <label className="block text-sm font-semibold">
        {text.message}
        <textarea
          name="message"
          required
          minLength={10}
          maxLength={5_000}
          rows={7}
          aria-invalid={Boolean(state.fieldErrors?.message)}
          aria-describedby={state.fieldErrors?.message ? "message-error" : undefined}
          className={`${inputClass} resize-y py-3`}
        />
        <FieldError state={state} name="message" />
      </label>

      <label className="flex cursor-pointer items-start gap-3 border-t border-hairline pt-6 text-sm leading-7 text-muted-foreground">
        <input
          name="consent"
          type="checkbox"
          required
          className="mt-1 size-4 accent-[var(--color-brand)]"
          aria-invalid={Boolean(state.fieldErrors?.consent)}
        />
        <span>{text.consent}</span>
      </label>
      <FieldError state={state} name="consent" />

      <SubmitButton locale={locale} />
    </form>
  );
}
