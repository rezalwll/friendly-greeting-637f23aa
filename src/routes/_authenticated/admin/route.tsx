import { Outlet, createFileRoute } from "@tanstack/react-router";

import { WorkspaceShell } from "@/components/workspace/shell";
import { adminNav } from "@/lib/workspace/nav";
import { useAuth } from "@/hooks/use-auth";
import { EmptyState, LoadingState } from "@/components/workspace/states";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const { loading, isStaff } = useAuth();

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24">
        <LoadingState rows={5} />
      </div>
    );
  }

  if (!isStaff) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24">
        <EmptyState
          title="دسترسی ندارید"
          description="این بخش مخصوص تیم رای‌کد است. دسترسی روی سرور کنترل می‌شود و با پنهان‌کردن منو محدود نشده است."
        />
      </div>
    );
  }

  return (
    <WorkspaceShell nav={adminNav} area="admin" areaLabel="پنل مدیریت">
      <Outlet />
    </WorkspaceShell>
  );
}
