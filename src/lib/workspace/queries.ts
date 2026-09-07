import { queryOptions } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";

async function unwrap<T>(promise: PromiseLike<{ data: T | null; error: { message: string } | null }>) {
  const { data, error } = await promise;
  if (error) throw new Error(error.message);
  return (data ?? []) as T;
}

/* ---------------------------------- client --------------------------------- */

export const myProjectsQuery = (userId: string) =>
  queryOptions({
    queryKey: ["my-projects", userId],
    queryFn: () =>
      unwrap(
        supabase
          .from("projects")
          .select("*")
          .eq("client_id", userId)
          .order("updated_at", { ascending: false }),
      ),
  });

export const projectQuery = (id: string) =>
  queryOptions({
    queryKey: ["project", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("projects").select("*").eq("id", id).maybeSingle();
      if (error) throw new Error(error.message);
      return data;
    },
  });

export const milestonesQuery = (projectId: string) =>
  queryOptions({
    queryKey: ["milestones", projectId],
    queryFn: () =>
      unwrap(
        supabase
          .from("milestones")
          .select("*")
          .eq("project_id", projectId)
          .order("position", { ascending: true }),
      ),
  });

export const projectActivityQuery = (projectId: string) =>
  queryOptions({
    queryKey: ["project-activity", projectId],
    queryFn: () =>
      unwrap(
        supabase
          .from("project_activities")
          .select("*")
          .eq("project_id", projectId)
          .order("created_at", { ascending: false })
          .limit(50),
      ),
  });

export const myFilesQuery = (userId: string, projectId?: string) =>
  queryOptions({
    queryKey: ["my-files", userId, projectId ?? "all"],
    queryFn: () => {
      let query = supabase
        .from("project_files")
        .select("*")
        .order("created_at", { ascending: false });
      if (projectId) query = query.eq("project_id", projectId);
      return unwrap(query);
    },
  });

export const myRequestsQuery = (userId: string) =>
  queryOptions({
    queryKey: ["my-requests", userId],
    queryFn: () =>
      unwrap(
        supabase
          .from("leads")
          .select("*")
          .eq("client_id", userId)
          .order("created_at", { ascending: false }),
      ),
  });

export const myInvoicesQuery = (userId: string) =>
  queryOptions({
    queryKey: ["my-invoices", userId],
    queryFn: () =>
      unwrap(
        supabase
          .from("invoices")
          .select("*, installments(*)")
          .eq("client_id", userId)
          .order("created_at", { ascending: false }),
      ),
  });

export const myTicketsQuery = (userId: string) =>
  queryOptions({
    queryKey: ["my-tickets", userId],
    queryFn: () =>
      unwrap(
        supabase
          .from("tickets")
          .select("*")
          .eq("client_id", userId)
          .order("updated_at", { ascending: false }),
      ),
  });

export const ticketMessagesQuery = (ticketId: string) =>
  queryOptions({
    queryKey: ["ticket-messages", ticketId],
    queryFn: () =>
      unwrap(
        supabase
          .from("ticket_messages")
          .select("*")
          .eq("ticket_id", ticketId)
          .order("created_at", { ascending: true }),
      ),
  });

export const myNotificationsQuery = (userId: string) =>
  queryOptions({
    queryKey: ["notifications", userId],
    queryFn: () =>
      unwrap(
        supabase
          .from("notifications")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .limit(100),
      ),
  });

export const myProfileQuery = (userId: string) =>
  queryOptions({
    queryKey: ["profile", userId],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();
      if (error) throw new Error(error.message);
      return data;
    },
  });

/* ----------------------------------- admin ---------------------------------- */

export const tableQuery = <T = unknown[]>(
  key: string,
  build: () => PromiseLike<{ data: unknown; error: { message: string } | null }>,
  extraKey: unknown[] = [],
) =>
  queryOptions({
    queryKey: [key, ...extraKey],
    queryFn: async () => {
      const { data, error } = await build();
      if (error) throw new Error(error.message);
      return (data ?? []) as T;
    },
  });
