import { createFileRoute } from "@tanstack/react-router";

import { ContentManager } from "@/components/workspace/content-manager";

export const Route = createFileRoute("/_authenticated/admin/content/solution")({
  component: () => <ContentManager kind="solution" />,
});
