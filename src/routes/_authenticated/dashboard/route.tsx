import { Outlet, createFileRoute } from "@tanstack/react-router";

import { WorkspaceShell } from "@/components/workspace/shell";
import { dashboardNav } from "@/lib/workspace/nav";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: DashboardLayout,
});

function DashboardLayout() {
  return (
    <WorkspaceShell nav={dashboardNav} area="dashboard" areaLabel="فضای کاری مشتری">
      <Outlet />
    </WorkspaceShell>
  );
}
