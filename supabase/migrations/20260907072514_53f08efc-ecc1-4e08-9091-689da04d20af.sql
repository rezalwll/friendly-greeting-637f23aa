
-- ENUMS
CREATE TYPE public.app_role AS ENUM ('super_admin','admin','support','editor','customer');
CREATE TYPE public.project_status AS ENUM ('planning','design','development','testing','waiting_client','completed','paused');
CREATE TYPE public.milestone_kind AS ENUM ('discovery','structure','design','development','testing','launch');
CREATE TYPE public.milestone_status AS ENUM ('pending','in_progress','waiting_approval','completed','skipped');
CREATE TYPE public.file_category AS ENUM ('contract','design','content','deliverable','invoice','technical','other');
CREATE TYPE public.lead_type AS ENUM ('project_request','technical_review','seo_audit','contact');
CREATE TYPE public.lead_status AS ENUM ('new','contacted','qualified','proposal','won','lost','archived','reviewing','need_info','proposal_sent','approved','rejected','converted');
CREATE TYPE public.invoice_status AS ENUM ('draft','issued','partially_paid','paid','cancelled');
CREATE TYPE public.installment_status AS ENUM ('upcoming','due','paid','overdue','cancelled');
CREATE TYPE public.ticket_status AS ENUM ('open','in_progress','waiting_customer','resolved','closed');
CREATE TYPE public.ticket_category AS ENUM ('technical','billing','project','seo','other');
CREATE TYPE public.ticket_priority AS ENUM ('normal','high','urgent');
CREATE TYPE public.content_kind AS ENUM ('service','solution','problem','industry','integration','case_study');
CREATE TYPE public.content_status AS ENUM ('draft','review','scheduled','published','archived');
CREATE TYPE public.translation_state AS ENUM ('missing','draft','complete','needs_update');
CREATE TYPE public.message_status AS ENUM ('new','read','replied','archived');

-- UTIL
CREATE OR REPLACE FUNCTION public.update_updated_at_column() RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ LANGUAGE plpgsql SET search_path = public;

-- PROFILES
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  email text,
  phone text,
  company text,
  locale text NOT NULL DEFAULT 'fa',
  status text NOT NULL DEFAULT 'active',
  last_activity_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE OR REPLACE FUNCTION public.is_staff(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id
    AND role IN ('super_admin','admin','support','editor'));
$$;

CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id
    AND role IN ('super_admin','admin'));
$$;

CREATE POLICY "profiles_self_select" ON public.profiles FOR SELECT TO authenticated
  USING (id = auth.uid() OR public.is_staff(auth.uid()));
CREATE POLICY "profiles_self_update" ON public.profiles FOR UPDATE TO authenticated
  USING (id = auth.uid() OR public.is_admin(auth.uid())) WITH CHECK (id = auth.uid() OR public.is_admin(auth.uid()));
CREATE POLICY "profiles_self_insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (id = auth.uid());

CREATE POLICY "user_roles_read" ON public.user_roles FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_staff(auth.uid()));

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, phone, company)
  VALUES (NEW.id, NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'phone',
    NEW.raw_user_meta_data->>'company')
  ON CONFLICT (id) DO NOTHING;
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'customer')
  ON CONFLICT DO NOTHING;
  RETURN NEW;
END; $$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- LEADS / REQUESTS
CREATE TABLE public.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  name text NOT NULL,
  company text,
  phone text,
  email text,
  lead_type public.lead_type NOT NULL DEFAULT 'contact',
  source text,
  landing_page text,
  service text,
  problem text,
  industry text,
  budget text,
  summary text,
  status public.lead_status NOT NULL DEFAULT 'new',
  owner_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  internal_note text,
  converted_project_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.leads TO authenticated;
GRANT INSERT ON public.leads TO anon;
GRANT ALL ON public.leads TO service_role;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "leads_public_insert" ON public.leads FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "leads_auth_insert" ON public.leads FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "leads_select" ON public.leads FOR SELECT TO authenticated
  USING (client_id = auth.uid() OR public.is_staff(auth.uid()));
CREATE POLICY "leads_staff_update" ON public.leads FOR UPDATE TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "leads_admin_delete" ON public.leads FOR DELETE TO authenticated USING (public.is_admin(auth.uid()));
CREATE TRIGGER leads_updated_at BEFORE UPDATE ON public.leads FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- PROJECTS
CREATE TABLE public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lead_id uuid REFERENCES public.leads(id) ON DELETE SET NULL,
  name text NOT NULL,
  slug text,
  scope text,
  status public.project_status NOT NULL DEFAULT 'planning',
  progress int NOT NULL DEFAULT 0,
  start_date date,
  expected_delivery date,
  latest_update text,
  client_action_required text,
  internal_note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.projects TO authenticated;
GRANT ALL ON public.projects TO service_role;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "projects_select" ON public.projects FOR SELECT TO authenticated
  USING (client_id = auth.uid() OR public.is_staff(auth.uid()));
CREATE POLICY "projects_staff_write" ON public.projects FOR ALL TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.milestones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  kind public.milestone_kind NOT NULL,
  title text NOT NULL,
  description text,
  status public.milestone_status NOT NULL DEFAULT 'pending',
  position int NOT NULL DEFAULT 0,
  start_date date,
  expected_completion date,
  deliverables text,
  client_approval_required boolean NOT NULL DEFAULT false,
  approved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.milestones TO authenticated;
GRANT ALL ON public.milestones TO service_role;
ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;
CREATE POLICY "milestones_select" ON public.milestones FOR SELECT TO authenticated
  USING (public.is_staff(auth.uid()) OR EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND p.client_id = auth.uid()));
CREATE POLICY "milestones_client_approve" ON public.milestones FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND p.client_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND p.client_id = auth.uid()));
CREATE POLICY "milestones_staff_write" ON public.milestones FOR ALL TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER milestones_updated_at BEFORE UPDATE ON public.milestones FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.project_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  actor_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  actor_label text,
  event_type text NOT NULL,
  description text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.project_activities TO authenticated;
GRANT ALL ON public.project_activities TO service_role;
ALTER TABLE public.project_activities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "activities_select" ON public.project_activities FOR SELECT TO authenticated
  USING (public.is_staff(auth.uid()) OR EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND p.client_id = auth.uid()));
CREATE POLICY "activities_insert" ON public.project_activities FOR INSERT TO authenticated
  WITH CHECK (public.is_staff(auth.uid()) OR EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND p.client_id = auth.uid()));

CREATE TABLE public.project_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE,
  client_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  uploaded_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  name text NOT NULL,
  category public.file_category NOT NULL DEFAULT 'other',
  storage_path text,
  size_bytes bigint,
  mime_type text,
  visible_to_client boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.project_files TO authenticated;
GRANT ALL ON public.project_files TO service_role;
ALTER TABLE public.project_files ENABLE ROW LEVEL SECURITY;
CREATE POLICY "files_select" ON public.project_files FOR SELECT TO authenticated
  USING (public.is_staff(auth.uid()) OR (visible_to_client AND (client_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND p.client_id = auth.uid()))));
CREATE POLICY "files_staff_write" ON public.project_files FOR ALL TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "files_client_insert" ON public.project_files FOR INSERT TO authenticated
  WITH CHECK (uploaded_by = auth.uid() AND (client_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND p.client_id = auth.uid())));

-- FINANCE
CREATE TABLE public.invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES public.projects(id) ON DELETE SET NULL,
  client_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  number text NOT NULL,
  title text,
  total_amount bigint NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'IRT',
  status public.invoice_status NOT NULL DEFAULT 'draft',
  issued_at date,
  due_date date,
  internal_note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.invoices TO authenticated;
GRANT ALL ON public.invoices TO service_role;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "invoices_select" ON public.invoices FOR SELECT TO authenticated
  USING (client_id = auth.uid() OR public.is_staff(auth.uid()));
CREATE POLICY "invoices_staff_write" ON public.invoices FOR ALL TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER invoices_updated_at BEFORE UPDATE ON public.invoices FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.installments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
  label text NOT NULL,
  amount bigint NOT NULL DEFAULT 0,
  due_date date,
  status public.installment_status NOT NULL DEFAULT 'upcoming',
  position int NOT NULL DEFAULT 0,
  internal_note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.installments TO authenticated;
GRANT ALL ON public.installments TO service_role;
ALTER TABLE public.installments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "installments_select" ON public.installments FOR SELECT TO authenticated
  USING (public.is_staff(auth.uid()) OR EXISTS (SELECT 1 FROM public.invoices i WHERE i.id = invoice_id AND i.client_id = auth.uid()));
CREATE POLICY "installments_staff_write" ON public.installments FOR ALL TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER installments_updated_at BEFORE UPDATE ON public.installments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid REFERENCES public.invoices(id) ON DELETE CASCADE,
  installment_id uuid REFERENCES public.installments(id) ON DELETE SET NULL,
  client_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  amount bigint NOT NULL DEFAULT 0,
  paid_at date,
  method text,
  reference text,
  receipt_path text,
  internal_note text,
  recorded_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.payments TO authenticated;
GRANT ALL ON public.payments TO service_role;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "payments_select" ON public.payments FOR SELECT TO authenticated
  USING (client_id = auth.uid() OR public.is_staff(auth.uid()));
CREATE POLICY "payments_staff_write" ON public.payments FOR ALL TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

-- SUPPORT
CREATE TABLE public.tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id uuid REFERENCES public.projects(id) ON DELETE SET NULL,
  subject text NOT NULL,
  category public.ticket_category NOT NULL DEFAULT 'other',
  priority public.ticket_priority NOT NULL DEFAULT 'normal',
  status public.ticket_status NOT NULL DEFAULT 'open',
  assignee_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  last_reply_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tickets TO authenticated;
GRANT ALL ON public.tickets TO service_role;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tickets_select" ON public.tickets FOR SELECT TO authenticated
  USING (client_id = auth.uid() OR public.is_staff(auth.uid()));
CREATE POLICY "tickets_client_insert" ON public.tickets FOR INSERT TO authenticated WITH CHECK (client_id = auth.uid());
CREATE POLICY "tickets_staff_write" ON public.tickets FOR ALL TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER tickets_updated_at BEFORE UPDATE ON public.tickets FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.ticket_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id uuid NOT NULL REFERENCES public.tickets(id) ON DELETE CASCADE,
  author_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  author_is_staff boolean NOT NULL DEFAULT false,
  body text NOT NULL,
  attachment_path text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.ticket_messages TO authenticated;
GRANT ALL ON public.ticket_messages TO service_role;
ALTER TABLE public.ticket_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ticket_messages_select" ON public.ticket_messages FOR SELECT TO authenticated
  USING (public.is_staff(auth.uid()) OR EXISTS (SELECT 1 FROM public.tickets t WHERE t.id = ticket_id AND t.client_id = auth.uid()));
CREATE POLICY "ticket_messages_insert" ON public.ticket_messages FOR INSERT TO authenticated
  WITH CHECK (author_id = auth.uid() AND (public.is_staff(auth.uid()) OR EXISTS (SELECT 1 FROM public.tickets t WHERE t.id = ticket_id AND t.client_id = auth.uid())));

CREATE TABLE public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text,
  phone text,
  subject text,
  body text NOT NULL,
  status public.message_status NOT NULL DEFAULT 'new',
  internal_note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, UPDATE, DELETE ON public.contact_messages TO authenticated;
GRANT INSERT ON public.contact_messages TO anon, authenticated;
GRANT ALL ON public.contact_messages TO service_role;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "contact_public_insert" ON public.contact_messages FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "contact_auth_insert" ON public.contact_messages FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "contact_staff_all" ON public.contact_messages FOR ALL TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER contact_messages_updated_at BEFORE UPDATE ON public.contact_messages FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- NOTIFICATIONS
CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  kind text NOT NULL,
  title text NOT NULL,
  body text,
  link text,
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "notifications_own" ON public.notifications FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_staff(auth.uid()));
CREATE POLICY "notifications_own_update" ON public.notifications FOR UPDATE TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "notifications_staff_insert" ON public.notifications FOR INSERT TO authenticated
  WITH CHECK (public.is_staff(auth.uid()));

-- CONTENT
CREATE TABLE public.authors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  name_fa text NOT NULL,
  name_en text,
  bio_fa text,
  bio_en text,
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name_fa text NOT NULL,
  name_en text,
  description_fa text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name_fa text NOT NULL,
  name_en text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.content_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind public.content_kind NOT NULL,
  slug text NOT NULL,
  title_fa text NOT NULL,
  title_en text,
  summary_fa text,
  summary_en text,
  body_fa text,
  body_en text,
  featured_image text,
  status public.content_status NOT NULL DEFAULT 'draft',
  translation_state public.translation_state NOT NULL DEFAULT 'missing',
  fa_updated_at timestamptz,
  en_updated_at timestamptz,
  published_at timestamptz,
  seo_title text,
  seo_description text,
  canonical_url text,
  no_index boolean NOT NULL DEFAULT false,
  og_image text,
  position int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (kind, slug)
);

CREATE TABLE public.articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title_fa text NOT NULL,
  title_en text,
  excerpt_fa text,
  excerpt_en text,
  body_fa text,
  body_en text,
  featured_image text,
  category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
  author_id uuid REFERENCES public.authors(id) ON DELETE SET NULL,
  status public.content_status NOT NULL DEFAULT 'draft',
  translation_state public.translation_state NOT NULL DEFAULT 'missing',
  fa_updated_at timestamptz,
  en_updated_at timestamptz,
  published_at timestamptz,
  seo_title text,
  seo_description text,
  canonical_url text,
  no_index boolean NOT NULL DEFAULT false,
  og_image text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.article_tags (
  article_id uuid NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  tag_id uuid NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
  PRIMARY KEY (article_id, tag_id)
);

CREATE TABLE public.content_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  from_type text NOT NULL,
  from_id uuid NOT NULL,
  to_type text NOT NULL,
  to_id uuid NOT NULL,
  relation text NOT NULL DEFAULT 'related',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (from_type, from_id, to_type, to_id, relation)
);

CREATE TABLE public.faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_fa text NOT NULL,
  answer_fa text NOT NULL,
  question_en text,
  answer_en text,
  status public.content_status NOT NULL DEFAULT 'draft',
  translation_state public.translation_state NOT NULL DEFAULT 'missing',
  position int NOT NULL DEFAULT 0,
  context text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.redirects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  old_url text NOT NULL UNIQUE,
  new_url text NOT NULL,
  type int NOT NULL DEFAULT 301,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.seo_metadata (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  path text NOT NULL UNIQUE,
  title_fa text,
  title_en text,
  description_fa text,
  description_en text,
  canonical_url text,
  no_index boolean NOT NULL DEFAULT false,
  og_image text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.site_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.authors, public.categories, public.tags, public.content_items,
  public.articles, public.article_tags, public.content_links, public.faqs,
  public.redirects, public.seo_metadata, public.site_settings TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.authors, public.categories, public.tags, public.content_items,
  public.articles, public.article_tags, public.content_links, public.faqs,
  public.redirects, public.seo_metadata, public.site_settings TO authenticated;
GRANT ALL ON public.authors, public.categories, public.tags, public.content_items,
  public.articles, public.article_tags, public.content_links, public.faqs,
  public.redirects, public.seo_metadata, public.site_settings TO service_role;

ALTER TABLE public.authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.redirects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "authors_public_read" ON public.authors FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "authors_staff_write" ON public.authors FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "categories_public_read" ON public.categories FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "categories_staff_write" ON public.categories FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "tags_public_read" ON public.tags FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "tags_staff_write" ON public.tags FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "content_public_read" ON public.content_items FOR SELECT TO anon USING (status = 'published');
CREATE POLICY "content_auth_read" ON public.content_items FOR SELECT TO authenticated USING (status = 'published' OR public.is_staff(auth.uid()));
CREATE POLICY "content_staff_write" ON public.content_items FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "articles_public_read" ON public.articles FOR SELECT TO anon USING (status = 'published');
CREATE POLICY "articles_auth_read" ON public.articles FOR SELECT TO authenticated USING (status = 'published' OR public.is_staff(auth.uid()));
CREATE POLICY "articles_staff_write" ON public.articles FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "article_tags_public_read" ON public.article_tags FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "article_tags_staff_write" ON public.article_tags FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "content_links_public_read" ON public.content_links FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "content_links_staff_write" ON public.content_links FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "faqs_public_read" ON public.faqs FOR SELECT TO anon USING (status = 'published');
CREATE POLICY "faqs_auth_read" ON public.faqs FOR SELECT TO authenticated USING (status = 'published' OR public.is_staff(auth.uid()));
CREATE POLICY "faqs_staff_write" ON public.faqs FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "redirects_public_read" ON public.redirects FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "redirects_staff_write" ON public.redirects FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "seo_public_read" ON public.seo_metadata FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "seo_staff_write" ON public.seo_metadata FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "settings_public_read" ON public.site_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "settings_admin_write" ON public.site_settings FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

CREATE TRIGGER content_items_updated_at BEFORE UPDATE ON public.content_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER articles_updated_at BEFORE UPDATE ON public.articles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER faqs_updated_at BEFORE UPDATE ON public.faqs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER redirects_updated_at BEFORE UPDATE ON public.redirects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER seo_updated_at BEFORE UPDATE ON public.seo_metadata FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ANALYTICS (internal only)
CREATE TABLE public.analytics_events (
  id bigserial PRIMARY KEY,
  event_name text NOT NULL,
  path text,
  page_type text,
  entity_id uuid,
  label text,
  value numeric,
  session_id text,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  locale text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX analytics_events_created_idx ON public.analytics_events (created_at DESC);
CREATE INDEX analytics_events_name_idx ON public.analytics_events (event_name);
GRANT INSERT ON public.analytics_events TO anon, authenticated;
GRANT USAGE, SELECT ON SEQUENCE public.analytics_events_id_seq TO anon, authenticated;
GRANT SELECT ON public.analytics_events TO authenticated;
GRANT ALL ON public.analytics_events TO service_role;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "analytics_anon_insert" ON public.analytics_events FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "analytics_auth_insert" ON public.analytics_events FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "analytics_staff_read" ON public.analytics_events FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));

CREATE TABLE public.activity_logs (
  id bigserial PRIMARY KEY,
  actor_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action text NOT NULL,
  entity_type text,
  entity_id text,
  details jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.activity_logs TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE public.activity_logs_id_seq TO authenticated;
GRANT ALL ON public.activity_logs TO service_role;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "logs_staff_read" ON public.activity_logs FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "logs_staff_insert" ON public.activity_logs FOR INSERT TO authenticated WITH CHECK (public.is_staff(auth.uid()));
