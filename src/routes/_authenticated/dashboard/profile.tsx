import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { PageHeader } from "@/components/workspace/shell";
import { LoadingState, Panel, StatusBadge } from "@/components/workspace/states";
import { myProfileQuery } from "@/lib/workspace/queries";
import { label, roleLabels } from "@/lib/workspace/labels";

export const Route = createFileRoute("/_authenticated/dashboard/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const { userId, email, roles } = useAuth();
  const queryClient = useQueryClient();
  const profile = useQuery({ ...myProfileQuery(userId ?? ""), enabled: !!userId });

  const [fullName, setFullName] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (profile.data) {
      setFullName(profile.data.full_name ?? "");
      setCompany(profile.data.company ?? "");
      setPhone(profile.data.phone ?? "");
    }
  }, [profile.data]);

  const save = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("profiles")
        .update({ full_name: fullName, company, phone })
        .eq("id", userId!);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["profile", userId] }),
  });

  return (
    <>
      <PageHeader title="پروفایل" description="اطلاعات حساب و نقش شما در فضای کاری." />

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="اطلاعات حساب">
          {profile.isLoading ? (
            <LoadingState rows={3} />
          ) : (
            <form
              className="space-y-3"
              onSubmit={(event) => {
                event.preventDefault();
                save.mutate();
              }}
            >
              <Row label="ایمیل" value={email ?? "—"} />
              <Field label="نام و نام خانوادگی" value={fullName} onChange={setFullName} />
              <Field label="نام کسب‌وکار" value={company} onChange={setCompany} />
              <Field label="شماره تماس" value={phone} onChange={setPhone} />
              {save.isSuccess && <p className="text-xs text-chart-5">تغییرات ذخیره شد.</p>}
              {save.isError && <p className="text-xs text-destructive">ذخیره انجام نشد.</p>}
              <button
                type="submit"
                disabled={save.isPending}
                className="rounded-md bg-foreground px-4 py-2 text-sm text-background disabled:opacity-60"
              >
                {save.isPending ? "در حال ذخیره…" : "ذخیره"}
              </button>
            </form>
          )}
        </Panel>

        <Panel title="نقش‌های شما" description="کنترل دسترسی روی سرور انجام می‌شود.">
          <div className="flex flex-wrap gap-2">
            {roles.length === 0 ? (
              <span className="text-xs text-muted-foreground">نقشی ثبت نشده است.</span>
            ) : (
              roles.map((role) => {
                const value = label(roleLabels, role);
                return (
                  <StatusBadge key={role} tone={value.tone}>
                    {value.fa}
                  </StatusBadge>
                );
              })
            )}
          </div>
        </Panel>
      </div>
    </>
  );
}

function Row({ label: labelText, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-sm">
      <span className="text-xs text-muted-foreground">{labelText}</span>
      <span>{value}</span>
    </div>
  );
}

function Field({
  label: labelText,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs text-muted-foreground">{labelText}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-brand"
      />
    </label>
  );
}
