import { createFileRoute } from "@tanstack/react-router";

import { ContentManager } from "@/components/workspace/content-manager";

export const Route = createFileRoute("/_authenticated/admin/content/integration")({
  component: () => <ContentManager kind="integration" />,
});
