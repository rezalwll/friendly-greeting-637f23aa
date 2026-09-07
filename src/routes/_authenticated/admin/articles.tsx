import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/workspace/shell";
import { DataTable, Panel, StatusBadge } from "@/components/workspace/states";
import {
  contentStatusLabels,
  formatDate,
  label,
  translationStateLabels,
} from "@/lib/workspace/labels";

export const Route = createFileRoute("/_authenticated/admin/articles")({
  component: ArticlesPage,
});

const empty = {
  title_fa: "",
  title_en: "",
  slug: "",
  excerpt_fa: "",
  excerpt_en: "",
  body_fa: "",
  body_en: "",
  seo_title: "",
  seo_description: "",
  status: "draft",
  translation_state: "missing",
  category_id: "",
  author_id: "",
};

function ArticlesPage() {
  const queryClient = useQueryClient();
  const [draft, setDraft] = useState<Record<string, string>>({ ...empty });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState<"fa" | "en">("fa");

  const articles = useQuery({
    queryKey: ["admin-articles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .order("updated_at", { ascending: false });
      if (error) throw new Error(error.message);
      return data;
    },
  });

  const taxonomies = useQuery({
    queryKey: ["article-taxonomies"],
    queryFn: async () => {
      const [{ data: categories }, { data: authors }] = await Promise.all([
        supabase.from("categories").select("id,name_fa"),
        supabase.from("authors").select("id,name_fa"),
      ]);
      return { categories: categories ?? [], authors: authors ?? [] };
    },
  });

  const save = useMutation({
    mutationFn: async () => {
      const payload = {
        title_fa: draft["title_fa"],
        title_en: draft["title_en"] || null,
        slug: draft["slug"],
        excerpt_fa: draft["excerpt_fa"] || null,
        excerpt_en: draft["excerpt_en"] || null,
        body_fa: draft["body_fa"] || null,
        body_en: draft["body_en"] || null,
        seo_title: draft["seo_title"] || null,
        seo_description: draft["seo_description"] || null,
        status: draft["status"] as never,
        translation_state: draft["translation_state"] as never,
        category_id: draft["category_id"] || null,
        author_id: draft["author_id"] || null,
        published_at: draft["status"] === "published" ? new Date().toISOString() : null,
        fa_updated_at: new Date().toISOString(),
      };
      const { error } = editingId
        ? await supabase.from("articles").update(payload).eq("id", editingId)
        : await supabase.from("articles").insert(payload);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      setDraft({ ...empty });
      setEditingId(null);
      setOpen(false);
      void queryClient.invalidateQueries({ queryKey: ["admin-articles"] });
    },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("articles").delete().eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-articles"] }),
  });

  const bind = (name: keyof typeof empty) => ({
    value: draft[name] ?? "",
    onChange: (event: { target: { value: string } }) =>
      setDraft({ ...draft, [name]: event.target.value }),
    className: "w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
  });

  return (
    <>
      <PageHeader
        title="مقاله‌ها"
        description="وبلاگ دومرحله‌ای: نسخه فارسی مرجع است و نسخه انگلیسی وضعیت ترجمه جداگانه دارد."
        actions={
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setDraft({ ...empty });
              setOpen((value) => !value);
            }}
            className="rounded-md border border-border px-3 py-1.5 text-xs hover:bg-muted"
          >
            {open ? "بستن ویرایشگر" : "مقاله جدید"}
          </button>
        }
      />

      {open && (
        <Panel className="mb-6" title={editingId ? "ویرایش مقاله" : "مقاله جدید"}>
          <div className="mb-4 inline-flex rounded-md border border-border p-1 text-xs">
            {(["fa", "en"] as const).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setLang(value)}
                className={`rounded px-3 py-1 ${lang === value ? "bg-foreground text-background" : ""}`}
              >
                {value === "fa" ? "فارسی" : "English"}
              </button>
            ))}
          </div>

          <form
            className="grid gap-4 md:grid-cols-2"
            onSubmit={(event) => {
              event.preventDefault();
              save.mutate();
            }}
          >
            <Field text={lang === "fa" ? "عنوان" : "Title"}>
              <input required={lang === "fa"} {...bind(lang === "fa" ? "title_fa" : "title_en")} />
            </Field>
            <Field text="نشانی (slug)">
              <input required dir="ltr" {...bind("slug")} />
            </Field>
            <Field text={lang === "fa" ? "خلاصه" : "Excerpt"} full>
              <textarea rows={3} {...bind(lang === "fa" ? "excerpt_fa" : "excerpt_en")} />
            </Field>
            <Field text={lang === "fa" ? "متن مقاله" : "Body"} full>
              <textarea rows={12} {...bind(lang === "fa" ? "body_fa" : "body_en")} />
            </Field>
            <Field text="دسته">
              <select {...bind("category_id")}>
                <option value="">—</option>
                {(taxonomies.data?.categories ?? []).map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name_fa}
                  </option>
                ))}
              </select>
            </Field>
            <Field text="نویسنده">
              <select {...bind("author_id")}>
                <option value="">—</option>
                {(taxonomies.data?.authors ?? []).map((author) => (
                  <option key={author.id} value={author.id}>
                    {author.name_fa}
                  </option>
                ))}
              </select>
            </Field>
            <Field text="عنوان سئو">
              <input {...bind("seo_title")} />
            </Field>
            <Field text="توضیح سئو">
              <input {...bind("seo_description")} />
            </Field>
            <Field text="وضعیت">
              <select {...bind("status")}>
                {Object.entries(contentStatusLabels).map(([value, item]) => (
                  <option key={value} value={value}>
                    {item.fa}
                  </option>
                ))}
              </select>
            </Field>
            <Field text="وضعیت ترجمه">
              <select {...bind("translation_state")}>
                {Object.entries(translationStateLabels).map(([value, item]) => (
                  <option key={value} value={value}>
                    {item.fa}
                  </option>
                ))}
              </select>
            </Field>

            <div className="md:col-span-2 flex items-center gap-3">
              <button
                type="submit"
                disabled={save.isPending}
                className="rounded-md bg-foreground px-4 py-2 text-sm text-background disabled:opacity-60"
              >
                {save.isPending ? "در حال ذخیره…" : "ذخیره"}
              </button>
              {save.isError && (
                <span className="text-xs text-destructive">{(save.error as Error).message}</span>
              )}
            </div>
          </form>
        </Panel>
      )}

      <Panel>
        <DataTable
          rows={articles.data ?? []}
          loading={articles.isLoading}
          error={articles.error}
          empty={{
            title: "مقاله‌ای ثبت نشده",
            description: "تا انتشار اولین مقاله، بخش وبلاگ سایت حالت خالی نمایش می‌دهد.",
          }}
          columns={[
            { key: "title", header: "عنوان", cell: (row) => row.title_fa },
            { key: "slug", header: "نشانی", cell: (row) => row.slug },
            {
              key: "status",
              header: "وضعیت",
              cell: (row) => {
                const value = label(contentStatusLabels, row.status);
                return <StatusBadge tone={value.tone}>{value.fa}</StatusBadge>;
              },
            },
            {
              key: "translation",
              header: "ترجمه",
              cell: (row) => {
                const value = label(translationStateLabels, row.translation_state);
                return <StatusBadge tone={value.tone}>{value.fa}</StatusBadge>;
              },
            },
            { key: "updated", header: "بروزرسانی", cell: (row) => formatDate(row.updated_at) },
            {
              key: "actions",
              header: "",
              cell: (row) => (
                <div className="flex gap-2 text-xs">
                  <button
                    type="button"
                    className="text-brand"
                    onClick={() => {
                      setEditingId(row.id);
                      setOpen(true);
                      setDraft({
                        title_fa: row.title_fa ?? "",
                        title_en: row.title_en ?? "",
                        slug: row.slug ?? "",
                        excerpt_fa: row.excerpt_fa ?? "",
                        excerpt_en: row.excerpt_en ?? "",
                        body_fa: row.body_fa ?? "",
                        body_en: row.body_en ?? "",
                        seo_title: row.seo_title ?? "",
                        seo_description: row.seo_description ?? "",
                        status: row.status,
                        translation_state: row.translation_state,
                        category_id: row.category_id ?? "",
                        author_id: row.author_id ?? "",
                      });
                    }}
                  >
                    ویرایش
                  </button>
                  <button
                    type="button"
                    className="text-destructive"
                    onClick={() => {
                      if (confirm("این مقاله حذف شود؟")) remove.mutate(row.id);
                    }}
                  >
                    حذف
                  </button>
                </div>
              ),
            },
          ]}
        />
      </Panel>
    </>
  );
}

function Field({
  text,
  full,
  children,
}: {
  text: string;
  full?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className={full ? "block md:col-span-2" : "block"}>
      <span className="mb-1 block text-xs text-muted-foreground">{text}</span>
      {children}
    </label>
  );
}
