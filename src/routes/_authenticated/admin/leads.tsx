import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/workspace/shell";
import { DataTable, Panel, StatusBadge } from "@/components/workspace/states";
import {
  formatDate,
  label,
  leadStatusLabels,
  leadTypeLabels,
} from "@/lib/workspace/labels";

export const Route = createFileRoute("/_authenticated/admin/leads")({
  component: LeadsPage,
});

function LeadsPage() {
  const queryClient = useQueryClient();
  const [type, setType] = useState("all");
  const [status, setStatus] = useState("all");
  const [selected, setSelected] = useState<string | null>(null);

  const leads = useQuery({
    queryKey: ["admin-leads"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw new Error(error.message);
      return data;
    },
  });

  const update = useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Record<string, unknown> }) => {
      const { error } = await supabase.from("leads").update(patch as never).eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-leads"] }),
  });

  const convert = useMutation({
    mutationFn: async (lead: { id: string; client_id: string | null; name: string; service: string | null }) => {
      if (!lead.client_id) throw new Error("این سرنخ به حساب کاربری متصل نیست.");
      const { data, error } = await supabase
        .from("projects")
        .insert({
          client_id: lead.client_id,
          lead_id: lead.id,
          name: lead.service ? `${lead.service} — ${lead.name}` : lead.name,
          status: "planning",
        })
        .select()
        .single();
      if (error) throw new Error(error.message);
      await supabase
        .from("leads")
        .update({ status: "converted", converted_project_id: data.id })
        .eq("id", lead.id);
      await supabase.from("activity_logs").insert({
        action: "lead_converted",
        entity_type: "lead",
        entity_id: lead.id,
        details: { project_id: data.id },
      });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin-leads"] });
    },
  });

  const rows = (leads.data ?? []).filter(
    (lead) =>
      (type === "all" || lead.lead_type === type) && (status === "all" || lead.status === status),
  );
  const current = rows.find((lead) => lead.id === selected) ?? null;

  return (
    <>
      <PageHeader title="سرنخ‌ها" description="مدیریت درخواست‌ها از تماس تا تبدیل به پروژه." />

      <div className="mb-5 flex flex-wrap gap-3">
        <Filter
          value={type}
          onChange={setType}
          options={[{ value: "all", label: "همه انواع" }, ...toOptions(leadTypeLabels)]}
        />
        <Filter
          value={status}
          onChange={setStatus}
          options={[{ value: "all", label: "همه وضعیت‌ها" }, ...toOptions(leadStatusLabels)]}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
        <Panel title="فهرست سرنخ‌ها">
          <DataTable
            rows={rows}
            loading={leads.isLoading}
            error={leads.error}
            empty={{
              title: "سرنخی ثبت نشده",
              description: "سرنخ‌ها از فرم‌های سایت (شروع پروژه، بررسی فنی، ممیزی سئو، تماس) ساخته می‌شوند.",
            }}
            columns={[
              {
                key: "name",
                header: "نام",
                cell: (row) => (
                  <button type="button" onClick={() => setSelected(row.id)} className="font-medium hover:text-brand">
                    {row.name}
                  </button>
                ),
              },
              { key: "company", header: "کسب‌وکار", cell: (row) => row.company ?? "—" },
              { key: "type", header: "نوع", cell: (row) => label(leadTypeLabels, row.lead_type).fa },
              {
                key: "status",
                header: "وضعیت",
                cell: (row) => {
                  const value = label(leadStatusLabels, row.status);
                  return <StatusBadge tone={value.tone}>{value.fa}</StatusBadge>;
                },
              },
              { key: "created", header: "تاریخ", cell: (row) => formatDate(row.created_at) },
            ]}
          />
        </Panel>

        <Panel title="جزئیات سرنخ">
          {!current ? (
            <p className="text-xs text-muted-foreground">یک سرنخ را از فهرست انتخاب کنید.</p>
          ) : (
            <div className="space-y-3 text-sm">
              <Row label="نام" value={current.name} />
              <Row label="کسب‌وکار" value={current.company ?? "—"} />
              <Row label="تلفن" value={current.phone ?? "—"} />
              <Row label="ایمیل" value={current.email ?? "—"} />
              <Row label="منبع" value={current.source ?? "—"} />
              <Row label="صفحه ورود" value={current.landing_page ?? "—"} />
              <Row label="خدمت" value={current.service ?? "—"} />
              <Row label="مشکل" value={current.problem ?? "—"} />
              <Row label="صنعت" value={current.industry ?? "—"} />
              <Row label="بودجه" value={current.budget ?? "—"} />

              <label className="block">
                <span className="mb-1 block text-xs text-muted-foreground">وضعیت</span>
                <select
                  value={current.status}
                  onChange={(event) =>
                    update.mutate({ id: current.id, patch: { status: event.target.value } })
                  }
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  {toOptions(leadStatusLabels).map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-1 block text-xs text-muted-foreground">یادداشت داخلی</span>
                <textarea
                  rows={4}
                  defaultValue={current.internal_note ?? ""}
                  onBlur={(event) =>
                    update.mutate({ id: current.id, patch: { internal_note: event.target.value } })
                  }
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </label>

              <button
                type="button"
                disabled={convert.isPending || current.status === "converted"}
                onClick={() => convert.mutate(current)}
                className="w-full rounded-md bg-foreground px-4 py-2 text-sm text-background disabled:opacity-60"
              >
                تبدیل به پروژه
              </button>
              {convert.isError && (
                <p className="text-xs text-destructive">{(convert.error as Error).message}</p>
              )}
            </div>
          )}
        </Panel>
      </div>
    </>
  );
}

function toOptions(dict: Record<string, { fa: string }>) {
  return Object.entries(dict).map(([value, item]) => ({ value, label: item.fa }));
}

function Filter({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="rounded-md border border-input bg-background px-3 py-1.5 text-xs"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

function Row({ label: labelText, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-1 text-xs">
      <span className="text-muted-foreground">{labelText}</span>
      <span className="text-foreground">{value}</span>
    </div>
  );
}
