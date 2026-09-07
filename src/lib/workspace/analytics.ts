// Internal-only analytics. No external provider is contacted; events are
// written to our own database and read back by the admin analytics screens.
import { supabase } from "@/integrations/supabase/client";

export type InternalEvent =
  | "page_view"
  | "cta_click"
  | "service_view"
  | "article_view"
  | "case_study_view"
  | "search"
  | "project_form_started"
  | "project_form_completed"
  | "technical_review_started"
  | "technical_review_completed"
  | "seo_audit_started"
  | "seo_audit_completed"
  | "login"
  | "register"
  | "file_download"
  | "contact_click"
  | "language_changed";

export type PageType =
  | "service"
  | "solution"
  | "problem"
  | "industry"
  | "article"
  | "case_study"
  | "marketing"
  | "workspace";

const SESSION_KEY = "rycode.session-id";

function sessionId() {
  if (typeof window === "undefined") return null;
  let id = window.sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    window.sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

export type TrackOptions = {
  path?: string;
  pageType?: PageType;
  entityId?: string;
  /** Short, non-sensitive label (CTA name, search term, form name). */
  label?: string;
  value?: number;
  metadata?: Record<string, string | number | boolean>;
};

/**
 * Records an internal event. Never send passwords, tokens, or the contents of
 * unsubmitted forms through this function.
 */
export async function trackEvent(event: InternalEvent, options: TrackOptions = {}) {
  if (typeof window === "undefined") return;
  try {
    const { data } = await supabase.auth.getSession();
    await supabase.from("analytics_events").insert({
      event_name: event,
      path: options.path ?? window.location.pathname,
      page_type: options.pageType ?? null,
      entity_id: options.entityId ?? null,
      label: options.label ?? null,
      value: options.value ?? null,
      session_id: sessionId(),
      user_id: data.session?.user.id ?? null,
      locale: document.documentElement.lang || "fa",
      metadata: options.metadata ?? {},
    });
  } catch {
    // Analytics must never break the page.
  }
}
