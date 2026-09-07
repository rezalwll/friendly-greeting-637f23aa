import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/hooks/use-auth";
import { Container } from "@/components/site/primitives";
import { Logo } from "@/components/site/logo";
import { trackEvent } from "@/lib/workspace/analytics";

const title = "ورود مشتری | رای‌کد";
const description = "ورود مشتریان رای‌کد به فضای کاری پیگیری پروژه.";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: Page,
});

function Page() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { session } = useAuth();

  useEffect(() => {
    if (session) navigate({ to: "/dashboard", replace: true });
  }, [session, navigate]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    setMessage(null);

    if (mode === "signin") {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) setError("ایمیل یا رمز عبور درست نیست.");
      else void trackEvent("login");
    } else {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
          data: { full_name: fullName, company, phone },
        },
      });
      if (signUpError) setError("ثبت‌نام انجام نشد. اطلاعات را بررسی کنید.");
      else if (!data.session)
        setMessage("حساب ساخته شد. برای فعال‌سازی، ایمیل تأیید را باز کنید.");
      else void trackEvent("register");
    }
    setBusy(false);
  }

  async function handleGoogle() {
    setError(null);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      setError("ورود با گوگل انجام نشد.");
      return;
    }
  }

  return (
    <div className="py-20 sm:py-28">
      <Container>
        <div className="mx-auto max-w-md rounded-2xl border border-border bg-card p-8">
          <Logo className="h-7" />
          <h1 className="mt-6 text-xl font-semibold tracking-tight">
            {mode === "signin" ? "ورود به فضای کاری" : "ساخت حساب مشتری"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            پیگیری پروژه، مراحل کار، فایل‌ها، صورتحساب‌ها و پشتیبانی در یک جا.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-3">
            {mode === "signup" && (
              <>
                <Field label="نام و نام خانوادگی" value={fullName} onChange={setFullName} required />
                <Field label="نام کسب‌وکار" value={company} onChange={setCompany} />
                <Field label="شماره تماس" value={phone} onChange={setPhone} />
              </>
            )}
            <Field label="ایمیل" type="email" value={email} onChange={setEmail} required />
            <Field
              label="رمز عبور"
              type="password"
              value={password}
              onChange={setPassword}
              required
            />

            {error && <p className="text-xs text-destructive">{error}</p>}
            {message && <p className="text-xs text-chart-5">{message}</p>}

            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-md bg-brand px-4 py-2.5 text-sm font-medium text-brand-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {busy ? "لطفاً صبر کنید…" : mode === "signin" ? "ورود" : "ثبت‌نام"}
            </button>
          </form>

          <button
            type="button"
            onClick={handleGoogle}
            className="mt-3 w-full rounded-md border border-border px-4 py-2.5 text-sm font-medium hover:bg-muted"
          >
            ورود با گوگل
          </button>

          <button
            type="button"
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="mt-4 w-full text-xs text-muted-foreground underline-offset-4 hover:underline"
          >
            {mode === "signin" ? "حساب ندارید؟ ثبت‌نام کنید" : "حساب دارید؟ وارد شوید"}
          </button>

          <Link
            to="/"
            className="mt-6 block text-center text-xs text-muted-foreground hover:text-foreground"
          >
            بازگشت به وب‌سایت
          </Link>
        </div>
      </Container>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs text-muted-foreground">{label}</span>
      <input
        type={type}
        value={value}
        required={required}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-brand"
      />
    </label>
  );
}
