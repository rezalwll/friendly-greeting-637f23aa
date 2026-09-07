import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/workspace/shell";
import { DataTable, Panel } from "@/components/workspace/states";
import { formatDate } from "@/lib/workspace/labels";

export const Route = createFileRoute("/_authenticated/admin/customers")({
  component: CustomersPage,
});

function CustomersPage() {
  const customers = useQuery({
    queryKey: ["admin-customers"],
    queryFn: async () => {
      const [{ data: profiles, error }, { data: projects }, { data: tickets }] = await Promise.all([
        supabase.from("profiles").select("*").order("created_at", { ascending: false }),
        supabase.from("projects").select("id,client_id"),
        supabase.from("tickets").select("id,client_id"),
      ]);
      if (error) throw new Error(error.message);
      return (profiles ?? []).map((profile) => ({
        ...profile,
        projects: (projects ?? []).filter((p) => p.client_id === profile.id).length,
        tickets: (tickets ?? []).filter((t) => t.client_id === profile.id).length,
      }));
    },
  });

  return (
    <>
      <PageHeader title="مشتریان" description="کاربران ثبت‌شده و حجم کار مرتبط با هرکدام." />
      <Panel>
        <DataTable
          rows={customers.data ?? []}
          loading={customers.isLoading}
          error={customers.error}
          empty={{ title: "هنوز کاربری ثبت‌نام نکرده است" }}
          columns={[
            { key: "name", header: "نام", cell: (row) => row.full_name ?? "—" },
            { key: "email", header: "ایمیل", cell: (row) => row.email ?? "—" },
            { key: "phone", header: "تلفن", cell: (row) => row.phone ?? "—" },
            { key: "company", header: "کسب‌وکار", cell: (row) => row.company ?? "—" },
            { key: "projects", header: "پروژه‌ها", cell: (row) => row.projects },
            { key: "tickets", header: "تیکت‌ها", cell: (row) => row.tickets },
            { key: "created", header: "عضویت", cell: (row) => formatDate(row.created_at) },
          ]}
        />
      </Panel>
    </>
  );
}
