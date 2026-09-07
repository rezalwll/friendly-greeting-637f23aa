import { createFileRoute } from "@tanstack/react-router";

import { ContentManager } from "@/components/workspace/content-manager";

export const Route = createFileRoute("/_authenticated/admin/content/problem")({
  component: () => <ContentManager kind="problem" />,
});
