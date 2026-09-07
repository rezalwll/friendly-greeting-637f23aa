import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/workspace/shell";
import { DataTable, Panel, StatusBadge } from "@/components/workspace/states";
import { formatDate, label, projectStatusLabels } from "@/lib/workspace/labels";

export const Route = createFileRoute("/_authenticated/admin/projects/")({
  component: AdminProjectsPage,
});

function AdminProjectsPage() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [clientId, setClientId] = useState("");

  const projects = useQuery({
    queryKey: ["admin-projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*, profiles:client_id(full_name,email)")
        .order("updated_at", { ascending: false });
      if (error) throw new Error(error.message);
      return data;
    },
  });

  const clients = useQuery({
    queryKey: ["admin-client-options"],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("id,full_name,email");
      if (error) throw new Error(error.message);
      return data;
    },
  });

  const create = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("projects").insert({ name, client_id: clientId });
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      setName("");
      setOpen(false);
      void queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
    },
  });

  return (
    <>
      <PageHeader
        title="پروژه‌ها"
        description="همه پروژه‌های در جریان و تکمیل‌شده."
        actions={
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="rounded-md border border-border px-3 py-1.5 text-xs hover:bg-muted"
          >
            {open ? "بستن" : "پروژه جدید"}
          </button>
        }
      />

      {open && (
        <Panel className="mb-6">
          <form
            className="grid gap-3 md:grid-cols-3"
            onSubmit={(event) => {
              event.preventDefault();
              create.mutate();
            }}
          >
            <label className="block md:col-span-1">
              <span className="mb-1 block text-xs text-muted-foreground">نام پروژه</span>
              <input
                value={name}
                required
                onChange={(event) => setName(event.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </label>
            <label className="block md:col-span-1">
              <span className="mb-1 block text-xs text-muted-foreground">مشتری</span>
              <select
                value={clientId}
                required
                onChange={(event) => setClientId(event.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">انتخاب کنید</option>
                {(clients.data ?? []).map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.full_name ?? client.email}
                  </option>
                ))}
              </select>
            </label>
            <div className="flex items-end">
              <button
                type="submit"
                className="rounded-md bg-foreground px-4 py-2 text-sm text-background"
              >
                ایجاد
              </button>
            </div>
            {create.isError && (
              <p className="text-xs text-destructive md:col-span-3">
                {(create.error as Error).message}
              </p>
            )}
          </form>
        </Panel>
      )}

      <Panel>
        <DataTable
          rows={projects.data ?? []}
          loading={projects.isLoading}
          error={projects.error}
          empty={{ title: "پروژه‌ای ثبت نشده" }}
          columns={[
            {
              key: "name",
              header: "پروژه",
              cell: (row) => (
                <Link
                  to="/admin/projects/$id"
                  params={{ id: row.id }}
                  className="font-medium hover:text-brand"
                >
                  {row.name}
                </Link>
              ),
            },
            {
              key: "client",
              header: "مشتری",
              cell: (row) =>
                (row.profiles as { full_name: string | null; email: string | null } | null)
                  ?.full_name ?? "—",
            },
            {
              key: "status",
              header: "وضعیت",
              cell: (row) => {
                const value = label(projectStatusLabels, row.status);
                return <StatusBadge tone={value.tone}>{value.fa}</StatusBadge>;
              },
            },
            { key: "progress", header: "پیشرفت", cell: (row) => `${row.progress}٪` },
            { key: "delivery", header: "تحویل", cell: (row) => formatDate(row.expected_delivery) },
          ]}
        />
      </Panel>
    </>
  );
}
