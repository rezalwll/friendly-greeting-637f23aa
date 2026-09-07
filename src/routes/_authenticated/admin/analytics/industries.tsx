import { createFileRoute } from "@tanstack/react-router";

import { AnalyticsView } from "@/components/workspace/analytics-views";

export const Route = createFileRoute("/_authenticated/admin/analytics/industries")({
  component: () => <AnalyticsView section="industries" />,
});
