import { createFileRoute } from "@tanstack/react-router";

import { AnalyticsView } from "@/components/workspace/analytics-views";

export const Route = createFileRoute("/_authenticated/admin/analytics/journeys")({
  component: () => <AnalyticsView section="journeys" />,
});
