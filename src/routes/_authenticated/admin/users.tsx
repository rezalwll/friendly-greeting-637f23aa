import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/workspace/shell";
import { DataTable, Panel, StatusBadge } from "@/components/workspace/states";
import { formatDate, label, roleLabels } from "@/lib/workspace/labels";

export const Route = createFileRoute("/_authenticated/admin/users")({
  component: UsersPage,
});

function UsersPage() {
  const users = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const [{ data: profiles, error }, { data: roles }] = await Promise.all([
        supabase.from("profiles").select("*").order("created_at", { ascending: false }),
        supabase.from("user_roles").select("user_id,role"),
      ]);
      if (error) throw new Error(error.message);
      return (profiles ?? []).map((profile) => ({
        ...profile,
        roles: (roles ?? []).filter((role) => role.user_id === profile.id).map((r) => r.role),
      }));
    },
  });

  return (
    <>
      <PageHeader
        title="کاربران"
        description="همه حساب‌های ثبت‌شده و نقش‌های فعلی آن‌ها. تخصیص نقش در صفحه «نقش‌ها» انجام می‌شود."
      />
      <Panel>
        <DataTable
          rows={users.data ?? []}
          loading={users.isLoading}
          error={users.error}
          empty={{ title: "کاربری وجود ندارد" }}
          columns={[
            { key: "name", header: "نام", cell: (row) => row.full_name ?? "—" },
            { key: "email", header: "ایمیل", cell: (row) => row.email ?? "—" },
            {
              key: "roles",
              header: "نقش‌ها",
              cell: (row) =>
                row.roles.length === 0 ? (
                  <StatusBadge>مشتری</StatusBadge>
                ) : (
                  <span className="flex flex-wrap gap-1">
                    {row.roles.map((role) => {
                      const value = label(roleLabels, role);
                      return (
                        <StatusBadge key={role} tone={value.tone}>
                          {value.fa}
                        </StatusBadge>
                      );
                    })}
                  </span>
                ),
            },
            { key: "created", header: "عضویت", cell: (row) => formatDate(row.created_at) },
            {
              key: "activity",
              header: "آخرین فعالیت",
              cell: (row) => formatDate(row.last_activity_at),
            },
          ]}
        />
      </Panel>
    </>
  );
}
