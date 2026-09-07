import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { PageHeader } from "@/components/workspace/shell";
import { DataTable, EmptyState, Panel, StatusBadge } from "@/components/workspace/states";
import { label, roleLabels } from "@/lib/workspace/labels";

export const Route = createFileRoute("/_authenticated/admin/roles")({
  component: RolesPage,
});

const assignable = ["super_admin", "admin", "support", "editor", "customer"] as const;

function RolesPage() {
  const { isAdmin } = useAuth();
  const queryClient = useQueryClient();
  const [userId, setUserId] = useState("");
  const [role, setRole] = useState<string>("support");

  const roles = useQuery({
    queryKey: ["admin-roles"],
    queryFn: async () => {
      const [{ data, error }, { data: profiles }] = await Promise.all([
        supabase.from("user_roles").select("*").order("created_at", { ascending: false }),
        supabase.from("profiles").select("id,full_name,email"),
      ]);
      if (error) throw new Error(error.message);
      return (data ?? []).map((row) => ({
        ...row,
        person:
          (profiles ?? []).find((profile) => profile.id === row.user_id)?.full_name ??
          (profiles ?? []).find((profile) => profile.id === row.user_id)?.email ??
          row.user_id,
      }));
    },
  });

  const people = useQuery({
    queryKey: ["admin-client-options"],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("id,full_name,email");
      if (error) throw new Error(error.message);
      return data;
    },
  });

  const assign = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("user_roles")
        .insert({ user_id: userId, role: role as never });
      if (error) throw new Error(error.message);
      await supabase.from("activity_logs").insert({
        action: "role_assigned",
        entity_type: "user",
        entity_id: userId,
        details: { role },
      });
    },
    onSuccess: () => {
      setUserId("");
      void queryClient.invalidateQueries({ queryKey: ["admin-roles"] });
    },
  });

  const revoke = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("user_roles").delete().eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-roles"] }),
  });

  if (!isAdmin) {
    return (
      <>
        <PageHeader title="نقش‌ها" />
        <EmptyState
          title="دسترسی ندارید"
          description="تنها مدیر و مدیر ارشد می‌توانند نقش‌ها را تغییر دهند."
        />
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="نقش‌ها"
        description="نقش‌ها جدا از پروفایل کاربر نگه‌داری می‌شوند و مبنای همه دسترسی‌های سرور هستند."
      />

      <Panel className="mb-6" title="تخصیص نقش">
        <form
          className="grid gap-3 md:grid-cols-3"
          onSubmit={(event) => {
            event.preventDefault();
            assign.mutate();
          }}
        >
          <select
            required
            value={userId}
            onChange={(event) => setUserId(event.target.value)}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="">انتخاب کاربر</option>
            {(people.data ?? []).map((person) => (
              <option key={person.id} value={person.id}>
                {person.full_name ?? person.email}
              </option>
            ))}
          </select>
          <select
            value={role}
            onChange={(event) => setRole(event.target.value)}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            {assignable.map((value) => (
              <option key={value} value={value}>
                {label(roleLabels, value).fa}
              </option>
            ))}
          </select>
          <button type="submit" className="rounded-md bg-foreground px-4 py-2 text-sm text-background">
            تخصیص
          </button>
          {assign.isError && (
            <p className="md:col-span-3 text-xs text-destructive">
              {(assign.error as Error).message}
            </p>
          )}
        </form>
      </Panel>

      <Panel title="نقش‌های فعلی">
        <DataTable
          rows={roles.data ?? []}
          loading={roles.isLoading}
          error={roles.error}
          empty={{ title: "نقشی تخصیص داده نشده" }}
          columns={[
            { key: "person", header: "کاربر", cell: (row) => row.person },
            {
              key: "role",
              header: "نقش",
              cell: (row) => {
                const value = label(roleLabels, row.role);
                return <StatusBadge tone={value.tone}>{value.fa}</StatusBadge>;
              },
            },
            {
              key: "actions",
              header: "",
              cell: (row) => (
                <button
                  type="button"
                  className="text-xs text-destructive"
                  onClick={() => {
                    if (confirm("این نقش حذف شود؟")) revoke.mutate(row.id);
                  }}
                >
                  حذف
                </button>
              ),
            },
          ]}
        />
      </Panel>
    </>
  );
}
