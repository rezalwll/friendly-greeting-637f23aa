import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/workspace/shell";
import {
  DataTable,
  EmptyState,
  LoadingState,
  Panel,
  StatusBadge,
} from "@/components/workspace/states";
import {
  formatDate,
  formatDateTime,
  label,
  milestoneKindLabels,
  milestoneStatusLabels,
  projectStatusLabels,
} from "@/lib/workspace/labels";

export const Route = createFileRoute("/_authenticated/admin/projects/$id")({
  component: AdminProjectDetail,
});

function AdminProjectDetail() {
  const { id } = Route.useParams();
  const queryClient = useQueryClient();
  const [milestone, setMilestone] = useState({ title: "", kind: "discovery", expected: "" });

  const project = useQuery({
    queryKey: ["admin-project", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("projects").select("*").eq("id", id).single();
      if (error) throw new Error(error.message);
      return data;
    },
  });

  const milestones = useQuery({
    queryKey: ["admin-milestones", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("milestones")
        .select("*")
        .eq("project_id", id)
        .order("position", { ascending: true });
      if (error) throw new Error(error.message);
      return data;
    },
  });

  const activities = useQuery({
    queryKey: ["admin-activities", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("project_activities")
        .select("*")
        .eq("project_id", id)
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw new Error(error.message);
      return data;
    },
  });

  const patch = useMutation({
    mutationFn: async (values: Record<string, unknown>) => {
      const { error } = await supabase.from("projects").update(values).eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-project", id] }),
  });

  const addMilestone = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("milestones").insert({
        project_id: id,
        title: milestone.title,
        kind: milestone.kind as never,
        expected_completion: milestone.expected || null,
        position: (milestones.data ?? []).length + 1,
      });
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      setMilestone({ title: "", kind: "discovery", expected: "" });
      void queryClient.invalidateQueries({ queryKey: ["admin-milestones", id] });
    },
  });

  const setMilestoneStatus = useMutation({
    mutationFn: async ({ mid, status }: { mid: string; status: string }) => {
      const { error } = await supabase
        .from("milestones")
        .update({ status: status as never })
        .eq("id", mid);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-milestones", id] }),
  });

  if (project.isLoading) return <LoadingState rows={5} />;
  if (!project.data) return <EmptyState title="پروژه پیدا نشد" />;

  const data = project.data;
  const status = label(projectStatusLabels, data.status);

  return (
    <>
      <PageHeader
        title={data.name}
        description="مدیریت وضعیت، مراحل و به‌روزرسانی‌های پروژه."
        actions={<StatusBadge tone={status.tone}>{status.fa}</StatusBadge>}
      />

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          <Panel title="مراحل پروژه">
            <form
              className="mb-4 grid gap-3 md:grid-cols-4"
              onSubmit={(event) => {
                event.preventDefault();
                addMilestone.mutate();
              }}
            >
              <input
                required
                placeholder="عنوان مرحله"
                value={milestone.title}
                onChange={(event) => setMilestone({ ...milestone, title: event.target.value })}
                className="rounded-md border border-input bg-background px-3 py-2 text-sm md:col-span-2"
              />
              <select
                value={milestone.kind}
                onChange={(event) => setMilestone({ ...milestone, kind: event.target.value })}
                className="rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                {Object.entries(milestoneKindLabels).map(([value, item]) => (
                  <option key={value} value={value}>
                    {item.fa}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="rounded-md bg-foreground px-4 py-2 text-sm text-background"
              >
                افزودن
              </button>
            </form>

            <DataTable
              rows={milestones.data ?? []}
              loading={milestones.isLoading}
              empty={{ title: "مرحله‌ای تعریف نشده" }}
              columns={[
                { key: "title", header: "مرحله", cell: (row) => row.title },
                {
                  key: "kind",
                  header: "نوع",
                  cell: (row) => label(milestoneKindLabels, row.kind).fa,
                },
                {
                  key: "expected",
                  header: "تحویل",
                  cell: (row) => formatDate(row.expected_completion),
                },
                {
                  key: "status",
                  header: "وضعیت",
                  cell: (row) => (
                    <select
                      value={row.status}
                      onChange={(event) =>
                        setMilestoneStatus.mutate({ mid: row.id, status: event.target.value })
                      }
                      className="rounded-md border border-input bg-background px-2 py-1 text-xs"
                    >
                      {Object.entries(milestoneStatusLabels).map(([value, item]) => (
                        <option key={value} value={value}>
                          {item.fa}
                        </option>
                      ))}
                    </select>
                  ),
                },
              ]}
            />
          </Panel>

          <Panel title="تاریخچه فعالیت">
            {(activities.data ?? []).length === 0 ? (
              <EmptyState title="فعالیتی ثبت نشده" />
            ) : (
              <ul className="space-y-2 text-sm">
                {(activities.data ?? []).map((activity) => (
                  <li key={activity.id} className="rounded-lg border border-border px-4 py-2">
                    <p>{activity.description ?? activity.event_type}</p>
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      {formatDateTime(activity.created_at)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>

        <Panel title="تنظیمات پروژه">
          <div className="space-y-4 text-sm">
            <label className="block">
              <span className="mb-1 block text-xs text-muted-foreground">وضعیت</span>
              <select
                value={data.status}
                onChange={(event) => patch.mutate({ status: event.target.value })}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                {Object.entries(projectStatusLabels).map(([value, item]) => (
                  <option key={value} value={value}>
                    {item.fa}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-1 block text-xs text-muted-foreground">پیشرفت (٪)</span>
              <input
                type="number"
                min={0}
                max={100}
                defaultValue={data.progress}
                onBlur={(event) => patch.mutate({ progress: Number(event.target.value) })}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-xs text-muted-foreground">تاریخ تحویل</span>
              <input
                type="date"
                defaultValue={data.expected_delivery ?? ""}
                onBlur={(event) => patch.mutate({ expected_delivery: event.target.value || null })}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-xs text-muted-foreground">آخرین به‌روزرسانی برای مشتری</span>
              <textarea
                rows={3}
                defaultValue={data.latest_update ?? ""}
                onBlur={(event) => patch.mutate({ latest_update: event.target.value })}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-xs text-muted-foreground">اقدام موردنیاز مشتری</span>
              <input
                defaultValue={data.client_action_required ?? ""}
                onBlur={(event) => patch.mutate({ client_action_required: event.target.value })}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-xs text-muted-foreground">یادداشت داخلی</span>
              <textarea
                rows={3}
                defaultValue={data.internal_note ?? ""}
                onBlur={(event) => patch.mutate({ internal_note: event.target.value })}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </label>
          </div>
        </Panel>
      </div>
    </>
  );
}
