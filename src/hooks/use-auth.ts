import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";

import { supabase } from "@/integrations/supabase/client";

export type AppRole = "super_admin" | "admin" | "support" | "editor" | "customer";

export type AuthState = {
  loading: boolean;
  session: Session | null;
  userId: string | null;
  email: string | null;
  roles: AppRole[];
  isStaff: boolean;
  isAdmin: boolean;
};

const staffRoles: AppRole[] = ["super_admin", "admin", "support", "editor"];

export function useAuth(): AuthState {
  const [session, setSession] = useState<Session | null>(null);
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadRoles = async (userId: string | null) => {
      if (!userId) {
        if (active) setRoles([]);
        return;
      }
      const { data } = await supabase.from("user_roles").select("role").eq("user_id", userId);
      if (active) setRoles((data ?? []).map((row) => row.role as AppRole));
    };

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
      // Defer the extra query so the auth callback stays synchronous.
      setTimeout(() => void loadRoles(next?.user.id ?? null), 0);
    });

    void (async () => {
      const { data } = await supabase.auth.getSession();
      if (!active) return;
      setSession(data.session);
      await loadRoles(data.session?.user.id ?? null);
      if (active) setLoading(false);
    })();

    return () => {
      active = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  return {
    loading,
    session,
    userId: session?.user.id ?? null,
    email: session?.user.email ?? null,
    roles,
    isStaff: roles.some((role) => staffRoles.includes(role)),
    isAdmin: roles.some((role) => role === "admin" || role === "super_admin"),
  };
}
