import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { PageHeader } from "@/components/workspace/shell";
import { EmptyState, ErrorState, LoadingState, Panel } from "@/components/workspace/states";
import { myNotificationsQuery } from "@/lib/workspace/queries";
import { formatDateTime } from "@/lib/workspace/labels";

export const Route = createFileRoute("/_authenticated/dashboard/notifications")({
  component: NotificationsPage,
});

function NotificationsPage() {
  const { userId } = useAuth();
  const queryClient = useQueryClient();
  const notifications = useQuery({ ...myNotificationsQuery(userId ?? ""), enabled: !!userId });

  const markRead = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("notifications")
        .update({ read_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications", userId] }),
  });

  return (
    <>
      <PageHeader
        title="اعلان‌ها"
        description="اعلان‌های داخلی فضای کاری؛ هیچ سرویس پیامکی یا ایمیلی خارجی متصل نیست."
      />
      <Panel>
        {notifications.isLoading ? (
          <LoadingState />
        ) : notifications.error ? (
          <ErrorState onRetry={() => notifications.refetch()} />
        ) : (notifications.data ?? []).length === 0 ? (
          <EmptyState
            title="اعلانی ندارید"
            description="بروزرسانی پروژه، فایل تازه، صورتحساب و پاسخ تیکت اینجا نمایش داده می‌شود."
          />
        ) : (
          <ul className="space-y-2">
            {(notifications.data ?? []).map((item) => (
              <li
                key={item.id}
                className={`rounded-lg border px-4 py-3 ${
                  item.read_at ? "border-border" : "border-brand/40 bg-brand/5"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-medium">{item.title}</p>
                  <span className="text-xs text-muted-foreground">
                    {formatDateTime(item.created_at)}
                  </span>
                </div>
                {item.body && <p className="mt-1 text-xs text-muted-foreground">{item.body}</p>}
                {!item.read_at && (
                  <button
                    type="button"
                    onClick={() => markRead.mutate(item.id)}
                    className="mt-2 text-xs text-brand"
                  >
                    علامت‌زدن به‌عنوان خوانده‌شده
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </>
  );
}
