import { Outlet, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

import { useAuth } from "@/hooks/use-auth";
import { LoadingState } from "@/components/workspace/states";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  const { loading, session } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !session) {
      navigate({ to: "/login", replace: true });
    }
  }, [loading, session, navigate]);

  if (loading || !session) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24">
        <LoadingState rows={5} />
      </div>
    );
  }

  return <Outlet />;
}
