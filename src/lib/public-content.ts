import { queryOptions } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type ContentKind = Database["public"]["Enums"]["content_kind"];
export type ContentItem = Database["public"]["Tables"]["content_items"]["Row"];
export type Article = Database["public"]["Tables"]["articles"]["Row"];
export type Faq = Database["public"]["Tables"]["faqs"]["Row"];

export const PAGE_SIZE = 12;

export type ListParams = { page: number; q: string };

/** Published content of one kind, paginated + searchable (scales to large datasets). */
export const contentListQuery = (kind: ContentKind, { page, q }: ListParams) =>
  queryOptions({
    queryKey: ["public-content", kind, page, q],
    queryFn: async () => {
      const from = (page - 1) * PAGE_SIZE;
      let query = supabase
        .from("content_items")
        .select("id,slug,kind,title_fa,title_en,summary_fa,summary_en,featured_image,published_at", {
          count: "exact",
        })
        .eq("kind", kind)
        .eq("status", "published")
        .order("position", { ascending: true })
        .order("published_at", { ascending: false })
        .range(from, from + PAGE_SIZE - 1);

      if (q.trim()) {
        const term = `%${q.trim()}%`;
        query = query.or(`title_fa.ilike.${term},summary_fa.ilike.${term},slug.ilike.${term}`);
      }

      const { data, error, count } = await query;
      if (error) throw new Error(error.message);
      return { rows: data ?? [], total: count ?? 0 };
    },
  });

export const contentItemQuery = (kind: ContentKind, slug: string) =>
  queryOptions({
    queryKey: ["public-content-item", kind, slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("content_items")
        .select("*")
        .eq("kind", kind)
        .eq("slug", slug)
        .eq("status", "published")
        .maybeSingle();
      if (error) throw new Error(error.message);
      return data as ContentItem | null;
    },
  });

export const articleListQuery = ({ page, q }: ListParams) =>
  queryOptions({
    queryKey: ["public-articles", page, q],
    queryFn: async () => {
      const from = (page - 1) * PAGE_SIZE;
      let query = supabase
        .from("articles")
        .select("id,slug,title_fa,excerpt_fa,featured_image,published_at", { count: "exact" })
        .eq("status", "published")
        .order("published_at", { ascending: false })
        .range(from, from + PAGE_SIZE - 1);

      if (q.trim()) {
        const term = `%${q.trim()}%`;
        query = query.or(`title_fa.ilike.${term},excerpt_fa.ilike.${term},slug.ilike.${term}`);
      }

      const { data, error, count } = await query;
      if (error) throw new Error(error.message);
      return { rows: data ?? [], total: count ?? 0 };
    },
  });

export const articleQuery = (slug: string) =>
  queryOptions({
    queryKey: ["public-article", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("slug", slug)
        .eq("status", "published")
        .maybeSingle();
      if (error) throw new Error(error.message);
      return data as Article | null;
    },
  });

export const publicFaqsQuery = () =>
  queryOptions({
    queryKey: ["public-faqs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("faqs")
        .select("*")
        .eq("status", "published")
        .order("position", { ascending: true });
      if (error) throw new Error(error.message);
      return (data ?? []) as Faq[];
    },
  });
