export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      activity_logs: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string
          details: Json
          entity_id: string | null
          entity_type: string | null
          id: number
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string
          details?: Json
          entity_id?: string | null
          entity_type?: string | null
          id?: number
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string
          details?: Json
          entity_id?: string | null
          entity_type?: string | null
          id?: number
        }
        Relationships: []
      }
      analytics_events: {
        Row: {
          created_at: string
          entity_id: string | null
          event_name: string
          id: number
          label: string | null
          locale: string | null
          metadata: Json
          page_type: string | null
          path: string | null
          session_id: string | null
          user_id: string | null
          value: number | null
        }
        Insert: {
          created_at?: string
          entity_id?: string | null
          event_name: string
          id?: number
          label?: string | null
          locale?: string | null
          metadata?: Json
          page_type?: string | null
          path?: string | null
          session_id?: string | null
          user_id?: string | null
          value?: number | null
        }
        Update: {
          created_at?: string
          entity_id?: string | null
          event_name?: string
          id?: number
          label?: string | null
          locale?: string | null
          metadata?: Json
          page_type?: string | null
          path?: string | null
          session_id?: string | null
          user_id?: string | null
          value?: number | null
        }
        Relationships: []
      }
      article_tags: {
        Row: {
          article_id: string
          tag_id: string
        }
        Insert: {
          article_id: string
          tag_id: string
        }
        Update: {
          article_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "article_tags_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "article_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      articles: {
        Row: {
          author_id: string | null
          body_en: string | null
          body_fa: string | null
          canonical_url: string | null
          category_id: string | null
          created_at: string
          en_updated_at: string | null
          excerpt_en: string | null
          excerpt_fa: string | null
          fa_updated_at: string | null
          featured_image: string | null
          id: string
          no_index: boolean
          og_image: string | null
          published_at: string | null
          seo_description: string | null
          seo_title: string | null
          slug: string
          status: Database["public"]["Enums"]["content_status"]
          title_en: string | null
          title_fa: string
          translation_state: Database["public"]["Enums"]["translation_state"]
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          body_en?: string | null
          body_fa?: string | null
          canonical_url?: string | null
          category_id?: string | null
          created_at?: string
          en_updated_at?: string | null
          excerpt_en?: string | null
          excerpt_fa?: string | null
          fa_updated_at?: string | null
          featured_image?: string | null
          id?: string
          no_index?: boolean
          og_image?: string | null
          published_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          status?: Database["public"]["Enums"]["content_status"]
          title_en?: string | null
          title_fa: string
          translation_state?: Database["public"]["Enums"]["translation_state"]
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          body_en?: string | null
          body_fa?: string | null
          canonical_url?: string | null
          category_id?: string | null
          created_at?: string
          en_updated_at?: string | null
          excerpt_en?: string | null
          excerpt_fa?: string | null
          fa_updated_at?: string | null
          featured_image?: string | null
          id?: string
          no_index?: boolean
          og_image?: string | null
          published_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["content_status"]
          title_en?: string | null
          title_fa?: string
          translation_state?: Database["public"]["Enums"]["translation_state"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "articles_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "authors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "articles_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      authors: {
        Row: {
          avatar_url: string | null
          bio_en: string | null
          bio_fa: string | null
          created_at: string
          id: string
          name_en: string | null
          name_fa: string
          user_id: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio_en?: string | null
          bio_fa?: string | null
          created_at?: string
          id?: string
          name_en?: string | null
          name_fa: string
          user_id?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio_en?: string | null
          bio_fa?: string | null
          created_at?: string
          id?: string
          name_en?: string | null
          name_fa?: string
          user_id?: string | null
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string
          description_fa: string | null
          id: string
          name_en: string | null
          name_fa: string
          slug: string
        }
        Insert: {
          created_at?: string
          description_fa?: string | null
          id?: string
          name_en?: string | null
          name_fa: string
          slug: string
        }
        Update: {
          created_at?: string
          description_fa?: string | null
          id?: string
          name_en?: string | null
          name_fa?: string
          slug?: string
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          body: string
          created_at: string
          email: string | null
          id: string
          internal_note: string | null
          name: string
          phone: string | null
          status: Database["public"]["Enums"]["message_status"]
          subject: string | null
          updated_at: string
        }
        Insert: {
          body: string
          created_at?: string
          email?: string | null
          id?: string
          internal_note?: string | null
          name: string
          phone?: string | null
          status?: Database["public"]["Enums"]["message_status"]
          subject?: string | null
          updated_at?: string
        }
        Update: {
          body?: string
          created_at?: string
          email?: string | null
          id?: string
          internal_note?: string | null
          name?: string
          phone?: string | null
          status?: Database["public"]["Enums"]["message_status"]
          subject?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      content_items: {
        Row: {
          body_en: string | null
          body_fa: string | null
          canonical_url: string | null
          created_at: string
          en_updated_at: string | null
          fa_updated_at: string | null
          featured_image: string | null
          id: string
          kind: Database["public"]["Enums"]["content_kind"]
          no_index: boolean
          og_image: string | null
          position: number
          published_at: string | null
          seo_description: string | null
          seo_title: string | null
          slug: string
          status: Database["public"]["Enums"]["content_status"]
          summary_en: string | null
          summary_fa: string | null
          title_en: string | null
          title_fa: string
          translation_state: Database["public"]["Enums"]["translation_state"]
          updated_at: string
        }
        Insert: {
          body_en?: string | null
          body_fa?: string | null
          canonical_url?: string | null
          created_at?: string
          en_updated_at?: string | null
          fa_updated_at?: string | null
          featured_image?: string | null
          id?: string
          kind: Database["public"]["Enums"]["content_kind"]
          no_index?: boolean
          og_image?: string | null
          position?: number
          published_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          status?: Database["public"]["Enums"]["content_status"]
          summary_en?: string | null
          summary_fa?: string | null
          title_en?: string | null
          title_fa: string
          translation_state?: Database["public"]["Enums"]["translation_state"]
          updated_at?: string
        }
        Update: {
          body_en?: string | null
          body_fa?: string | null
          canonical_url?: string | null
          created_at?: string
          en_updated_at?: string | null
          fa_updated_at?: string | null
          featured_image?: string | null
          id?: string
          kind?: Database["public"]["Enums"]["content_kind"]
          no_index?: boolean
          og_image?: string | null
          position?: number
          published_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["content_status"]
          summary_en?: string | null
          summary_fa?: string | null
          title_en?: string | null
          title_fa?: string
          translation_state?: Database["public"]["Enums"]["translation_state"]
          updated_at?: string
        }
        Relationships: []
      }
      content_links: {
        Row: {
          created_at: string
          from_id: string
          from_type: string
          id: string
          relation: string
          to_id: string
          to_type: string
        }
        Insert: {
          created_at?: string
          from_id: string
          from_type: string
          id?: string
          relation?: string
          to_id: string
          to_type: string
        }
        Update: {
          created_at?: string
          from_id?: string
          from_type?: string
          id?: string
          relation?: string
          to_id?: string
          to_type?: string
        }
        Relationships: []
      }
      faqs: {
        Row: {
          answer_en: string | null
          answer_fa: string
          context: string | null
          created_at: string
          id: string
          position: number
          question_en: string | null
          question_fa: string
          status: Database["public"]["Enums"]["content_status"]
          translation_state: Database["public"]["Enums"]["translation_state"]
          updated_at: string
        }
        Insert: {
          answer_en?: string | null
          answer_fa: string
          context?: string | null
          created_at?: string
          id?: string
          position?: number
          question_en?: string | null
          question_fa: string
          status?: Database["public"]["Enums"]["content_status"]
          translation_state?: Database["public"]["Enums"]["translation_state"]
          updated_at?: string
        }
        Update: {
          answer_en?: string | null
          answer_fa?: string
          context?: string | null
          created_at?: string
          id?: string
          position?: number
          question_en?: string | null
          question_fa?: string
          status?: Database["public"]["Enums"]["content_status"]
          translation_state?: Database["public"]["Enums"]["translation_state"]
          updated_at?: string
        }
        Relationships: []
      }
      installments: {
        Row: {
          amount: number
          created_at: string
          due_date: string | null
          id: string
          internal_note: string | null
          invoice_id: string
          label: string
          position: number
          status: Database["public"]["Enums"]["installment_status"]
          updated_at: string
        }
        Insert: {
          amount?: number
          created_at?: string
          due_date?: string | null
          id?: string
          internal_note?: string | null
          invoice_id: string
          label: string
          position?: number
          status?: Database["public"]["Enums"]["installment_status"]
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          due_date?: string | null
          id?: string
          internal_note?: string | null
          invoice_id?: string
          label?: string
          position?: number
          status?: Database["public"]["Enums"]["installment_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "installments_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          client_id: string
          created_at: string
          currency: string
          due_date: string | null
          id: string
          internal_note: string | null
          issued_at: string | null
          number: string
          project_id: string | null
          status: Database["public"]["Enums"]["invoice_status"]
          title: string | null
          total_amount: number
          updated_at: string
        }
        Insert: {
          client_id: string
          created_at?: string
          currency?: string
          due_date?: string | null
          id?: string
          internal_note?: string | null
          issued_at?: string | null
          number: string
          project_id?: string | null
          status?: Database["public"]["Enums"]["invoice_status"]
          title?: string | null
          total_amount?: number
          updated_at?: string
        }
        Update: {
          client_id?: string
          created_at?: string
          currency?: string
          due_date?: string | null
          id?: string
          internal_note?: string | null
          issued_at?: string | null
          number?: string
          project_id?: string | null
          status?: Database["public"]["Enums"]["invoice_status"]
          title?: string | null
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          budget: string | null
          client_id: string | null
          company: string | null
          converted_project_id: string | null
          created_at: string
          email: string | null
          id: string
          industry: string | null
          internal_note: string | null
          landing_page: string | null
          lead_type: Database["public"]["Enums"]["lead_type"]
          name: string
          owner_id: string | null
          phone: string | null
          problem: string | null
          service: string | null
          source: string | null
          status: Database["public"]["Enums"]["lead_status"]
          summary: string | null
          updated_at: string
        }
        Insert: {
          budget?: string | null
          client_id?: string | null
          company?: string | null
          converted_project_id?: string | null
          created_at?: string
          email?: string | null
          id?: string
          industry?: string | null
          internal_note?: string | null
          landing_page?: string | null
          lead_type?: Database["public"]["Enums"]["lead_type"]
          name: string
          owner_id?: string | null
          phone?: string | null
          problem?: string | null
          service?: string | null
          source?: string | null
          status?: Database["public"]["Enums"]["lead_status"]
          summary?: string | null
          updated_at?: string
        }
        Update: {
          budget?: string | null
          client_id?: string | null
          company?: string | null
          converted_project_id?: string | null
          created_at?: string
          email?: string | null
          id?: string
          industry?: string | null
          internal_note?: string | null
          landing_page?: string | null
          lead_type?: Database["public"]["Enums"]["lead_type"]
          name?: string
          owner_id?: string | null
          phone?: string | null
          problem?: string | null
          service?: string | null
          source?: string | null
          status?: Database["public"]["Enums"]["lead_status"]
          summary?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      milestones: {
        Row: {
          approved_at: string | null
          client_approval_required: boolean
          created_at: string
          deliverables: string | null
          description: string | null
          expected_completion: string | null
          id: string
          kind: Database["public"]["Enums"]["milestone_kind"]
          position: number
          project_id: string
          start_date: string | null
          status: Database["public"]["Enums"]["milestone_status"]
          title: string
          updated_at: string
        }
        Insert: {
          approved_at?: string | null
          client_approval_required?: boolean
          created_at?: string
          deliverables?: string | null
          description?: string | null
          expected_completion?: string | null
          id?: string
          kind: Database["public"]["Enums"]["milestone_kind"]
          position?: number
          project_id: string
          start_date?: string | null
          status?: Database["public"]["Enums"]["milestone_status"]
          title: string
          updated_at?: string
        }
        Update: {
          approved_at?: string | null
          client_approval_required?: boolean
          created_at?: string
          deliverables?: string | null
          description?: string | null
          expected_completion?: string | null
          id?: string
          kind?: Database["public"]["Enums"]["milestone_kind"]
          position?: number
          project_id?: string
          start_date?: string | null
          status?: Database["public"]["Enums"]["milestone_status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "milestones_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          id: string
          kind: string
          link: string | null
          read_at: string | null
          title: string
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          kind: string
          link?: string | null
          read_at?: string | null
          title: string
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          kind?: string
          link?: string | null
          read_at?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          client_id: string | null
          created_at: string
          id: string
          installment_id: string | null
          internal_note: string | null
          invoice_id: string | null
          method: string | null
          paid_at: string | null
          receipt_path: string | null
          recorded_by: string | null
          reference: string | null
        }
        Insert: {
          amount?: number
          client_id?: string | null
          created_at?: string
          id?: string
          installment_id?: string | null
          internal_note?: string | null
          invoice_id?: string | null
          method?: string | null
          paid_at?: string | null
          receipt_path?: string | null
          recorded_by?: string | null
          reference?: string | null
        }
        Update: {
          amount?: number
          client_id?: string | null
          created_at?: string
          id?: string
          installment_id?: string | null
          internal_note?: string | null
          invoice_id?: string | null
          method?: string | null
          paid_at?: string | null
          receipt_path?: string | null
          recorded_by?: string | null
          reference?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_installment_id_fkey"
            columns: ["installment_id"]
            isOneToOne: false
            referencedRelation: "installments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          company: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          last_activity_at: string | null
          locale: string
          phone: string | null
          status: string
          updated_at: string
        }
        Insert: {
          company?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          last_activity_at?: string | null
          locale?: string
          phone?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          last_activity_at?: string | null
          locale?: string
          phone?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      project_activities: {
        Row: {
          actor_id: string | null
          actor_label: string | null
          created_at: string
          description: string | null
          event_type: string
          id: string
          project_id: string
        }
        Insert: {
          actor_id?: string | null
          actor_label?: string | null
          created_at?: string
          description?: string | null
          event_type: string
          id?: string
          project_id: string
        }
        Update: {
          actor_id?: string | null
          actor_label?: string | null
          created_at?: string
          description?: string | null
          event_type?: string
          id?: string
          project_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_activities_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_files: {
        Row: {
          category: Database["public"]["Enums"]["file_category"]
          client_id: string | null
          created_at: string
          id: string
          mime_type: string | null
          name: string
          project_id: string | null
          size_bytes: number | null
          storage_path: string | null
          uploaded_by: string | null
          visible_to_client: boolean
        }
        Insert: {
          category?: Database["public"]["Enums"]["file_category"]
          client_id?: string | null
          created_at?: string
          id?: string
          mime_type?: string | null
          name: string
          project_id?: string | null
          size_bytes?: number | null
          storage_path?: string | null
          uploaded_by?: string | null
          visible_to_client?: boolean
        }
        Update: {
          category?: Database["public"]["Enums"]["file_category"]
          client_id?: string | null
          created_at?: string
          id?: string
          mime_type?: string | null
          name?: string
          project_id?: string | null
          size_bytes?: number | null
          storage_path?: string | null
          uploaded_by?: string | null
          visible_to_client?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "project_files_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          client_action_required: string | null
          client_id: string
          created_at: string
          expected_delivery: string | null
          id: string
          internal_note: string | null
          latest_update: string | null
          lead_id: string | null
          name: string
          progress: number
          scope: string | null
          slug: string | null
          start_date: string | null
          status: Database["public"]["Enums"]["project_status"]
          updated_at: string
        }
        Insert: {
          client_action_required?: string | null
          client_id: string
          created_at?: string
          expected_delivery?: string | null
          id?: string
          internal_note?: string | null
          latest_update?: string | null
          lead_id?: string | null
          name: string
          progress?: number
          scope?: string | null
          slug?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["project_status"]
          updated_at?: string
        }
        Update: {
          client_action_required?: string | null
          client_id?: string
          created_at?: string
          expected_delivery?: string | null
          id?: string
          internal_note?: string | null
          latest_update?: string | null
          lead_id?: string | null
          name?: string
          progress?: number
          scope?: string | null
          slug?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["project_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      redirects: {
        Row: {
          active: boolean
          created_at: string
          id: string
          new_url: string
          old_url: string
          type: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          id?: string
          new_url: string
          old_url: string
          type?: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          id?: string
          new_url?: string
          old_url?: string
          type?: number
          updated_at?: string
        }
        Relationships: []
      }
      seo_metadata: {
        Row: {
          canonical_url: string | null
          created_at: string
          description_en: string | null
          description_fa: string | null
          id: string
          no_index: boolean
          og_image: string | null
          path: string
          title_en: string | null
          title_fa: string | null
          updated_at: string
        }
        Insert: {
          canonical_url?: string | null
          created_at?: string
          description_en?: string | null
          description_fa?: string | null
          id?: string
          no_index?: boolean
          og_image?: string | null
          path: string
          title_en?: string | null
          title_fa?: string | null
          updated_at?: string
        }
        Update: {
          canonical_url?: string | null
          created_at?: string
          description_en?: string | null
          description_fa?: string | null
          id?: string
          no_index?: boolean
          og_image?: string | null
          path?: string
          title_en?: string | null
          title_fa?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string
          value?: Json
        }
        Update: {
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      tags: {
        Row: {
          created_at: string
          id: string
          name_en: string | null
          name_fa: string
          slug: string
        }
        Insert: {
          created_at?: string
          id?: string
          name_en?: string | null
          name_fa: string
          slug: string
        }
        Update: {
          created_at?: string
          id?: string
          name_en?: string | null
          name_fa?: string
          slug?: string
        }
        Relationships: []
      }
      ticket_messages: {
        Row: {
          attachment_path: string | null
          author_id: string | null
          author_is_staff: boolean
          body: string
          created_at: string
          id: string
          ticket_id: string
        }
        Insert: {
          attachment_path?: string | null
          author_id?: string | null
          author_is_staff?: boolean
          body: string
          created_at?: string
          id?: string
          ticket_id: string
        }
        Update: {
          attachment_path?: string | null
          author_id?: string | null
          author_is_staff?: boolean
          body?: string
          created_at?: string
          id?: string
          ticket_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ticket_messages_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      tickets: {
        Row: {
          assignee_id: string | null
          category: Database["public"]["Enums"]["ticket_category"]
          client_id: string
          created_at: string
          id: string
          last_reply_at: string | null
          priority: Database["public"]["Enums"]["ticket_priority"]
          project_id: string | null
          status: Database["public"]["Enums"]["ticket_status"]
          subject: string
          updated_at: string
        }
        Insert: {
          assignee_id?: string | null
          category?: Database["public"]["Enums"]["ticket_category"]
          client_id: string
          created_at?: string
          id?: string
          last_reply_at?: string | null
          priority?: Database["public"]["Enums"]["ticket_priority"]
          project_id?: string | null
          status?: Database["public"]["Enums"]["ticket_status"]
          subject: string
          updated_at?: string
        }
        Update: {
          assignee_id?: string | null
          category?: Database["public"]["Enums"]["ticket_category"]
          client_id?: string
          created_at?: string
          id?: string
          last_reply_at?: string | null
          priority?: Database["public"]["Enums"]["ticket_priority"]
          project_id?: string | null
          status?: Database["public"]["Enums"]["ticket_status"]
          subject?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tickets_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: { _user_id: string }; Returns: boolean }
      is_staff: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "super_admin" | "admin" | "support" | "editor" | "customer"
      content_kind:
        | "service"
        | "solution"
        | "problem"
        | "industry"
        | "integration"
        | "case_study"
      content_status:
        | "draft"
        | "review"
        | "scheduled"
        | "published"
        | "archived"
      file_category:
        | "contract"
        | "design"
        | "content"
        | "deliverable"
        | "invoice"
        | "technical"
        | "other"
      installment_status: "upcoming" | "due" | "paid" | "overdue" | "cancelled"
      invoice_status:
        | "draft"
        | "issued"
        | "partially_paid"
        | "paid"
        | "cancelled"
      lead_status:
        | "new"
        | "contacted"
        | "qualified"
        | "proposal"
        | "won"
        | "lost"
        | "archived"
        | "reviewing"
        | "need_info"
        | "proposal_sent"
        | "approved"
        | "rejected"
        | "converted"
      lead_type:
        | "project_request"
        | "technical_review"
        | "seo_audit"
        | "contact"
      message_status: "new" | "read" | "replied" | "archived"
      milestone_kind:
        | "discovery"
        | "structure"
        | "design"
        | "development"
        | "testing"
        | "launch"
      milestone_status:
        | "pending"
        | "in_progress"
        | "waiting_approval"
        | "completed"
        | "skipped"
      project_status:
        | "planning"
        | "design"
        | "development"
        | "testing"
        | "waiting_client"
        | "completed"
        | "paused"
      ticket_category: "technical" | "billing" | "project" | "seo" | "other"
      ticket_priority: "normal" | "high" | "urgent"
      ticket_status:
        | "open"
        | "in_progress"
        | "waiting_customer"
        | "resolved"
        | "closed"
      translation_state: "missing" | "draft" | "complete" | "needs_update"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["super_admin", "admin", "support", "editor", "customer"],
      content_kind: [
        "service",
        "solution",
        "problem",
        "industry",
        "integration",
        "case_study",
      ],
      content_status: ["draft", "review", "scheduled", "published", "archived"],
      file_category: [
        "contract",
        "design",
        "content",
        "deliverable",
        "invoice",
        "technical",
        "other",
      ],
      installment_status: ["upcoming", "due", "paid", "overdue", "cancelled"],
      invoice_status: [
        "draft",
        "issued",
        "partially_paid",
        "paid",
        "cancelled",
      ],
      lead_status: [
        "new",
        "contacted",
        "qualified",
        "proposal",
        "won",
        "lost",
        "archived",
        "reviewing",
        "need_info",
        "proposal_sent",
        "approved",
        "rejected",
        "converted",
      ],
      lead_type: [
        "project_request",
        "technical_review",
        "seo_audit",
        "contact",
      ],
      message_status: ["new", "read", "replied", "archived"],
      milestone_kind: [
        "discovery",
        "structure",
        "design",
        "development",
        "testing",
        "launch",
      ],
      milestone_status: [
        "pending",
        "in_progress",
        "waiting_approval",
        "completed",
        "skipped",
      ],
      project_status: [
        "planning",
        "design",
        "development",
        "testing",
        "waiting_client",
        "completed",
        "paused",
      ],
      ticket_category: ["technical", "billing", "project", "seo", "other"],
      ticket_priority: ["normal", "high", "urgent"],
      ticket_status: [
        "open",
        "in_progress",
        "waiting_customer",
        "resolved",
        "closed",
      ],
      translation_state: ["missing", "draft", "complete", "needs_update"],
    },
  },
} as const
