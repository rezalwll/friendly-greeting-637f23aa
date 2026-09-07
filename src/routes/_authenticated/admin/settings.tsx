import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/workspace/shell";
import { DataTable, Panel } from "@/components/workspace/states";

export const Route = createFileRoute("/_authenticated/admin/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const queryClient = useQueryClient();
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");

  const settings = useQuery({
    queryKey: ["site-settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_settings").select("*").order("key");
      if (error) throw new Error(error.message);
      return data;
    },
  });

  const save = useMutation({
    mutationFn: async () => {
      let parsed: unknown = value;
      try {
        parsed = JSON.parse(value);
      } catch {
        parsed = value;
      }
      const { error } = await supabase
        .from("site_settings")
        .upsert({ key, value: parsed as never }, { onConflict: "key" });
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      setKey("");
      setValue("");
      void queryClient.invalidateQueries({ queryKey: ["site-settings"] });
    },
  });

  return (
    <>
      <PageHeader
        title="تنظیمات سایت"
        description="اطلاعات تماس، متن‌های عمومی و کلیدهای داخلی. هیچ کلید سرویس بیرونی اینجا ذخیره نمی‌شود."
      />

      <Panel className="mb-6" title="افزودن یا بروزرسانی تنظیم">
        <form
          className="grid gap-3 md:grid-cols-3"
          onSubmit={(event) => {
            event.preventDefault();
            save.mutate();
          }}
        >
          <input
            required
            placeholder="کلید (مثلاً contact.phone)"
            value={key}
            onChange={(event) => setKey(event.target.value)}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
          <input
            required
            placeholder="مقدار"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm md:col-span-1"
          />
          <button
            type="submit"
            className="rounded-md bg-foreground px-4 py-2 text-sm text-background"
          >
            ذخیره
          </button>
          {save.isError && (
            <p className="md:col-span-3 text-xs text-destructive">
              {(save.error as Error).message}
            </p>
          )}
        </form>
      </Panel>

      <Panel title="تنظیمات فعلی">
        <DataTable
          rows={(settings.data ?? []).map((row) => ({ ...row, id: row.key }))}
          loading={settings.isLoading}
          error={settings.error}
          empty={{ title: "تنظیمی ثبت نشده" }}
          columns={[
            { key: "key", header: "کلید", cell: (row) => row.key },
            { key: "value", header: "مقدار", cell: (row) => JSON.stringify(row.value) },
          ]}
        />
      </Panel>
    </>
  );
}
