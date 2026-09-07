import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/workspace/shell";
import { DataTable, Panel, StatusBadge } from "@/components/workspace/states";
import {
  contentKindLabels,
  contentStatusLabels,
  formatDate,
  label,
  translationStateLabels,
} from "@/lib/workspace/labels";

type Kind = "service" | "solution" | "problem" | "industry" | "integration" | "case_study";

const emptyDraft = {
  title_fa: "",
  title_en: "",
  slug: "",
  summary_fa: "",
  summary_en: "",
  body_fa: "",
  body_en: "",
  seo_title: "",
  seo_description: "",
  status: "draft",
  translation_state: "missing",
  no_index: "false",
};

/**
 * Bilingual CMS editor for a single content kind. Persian is the source of
 * truth; the English column is optional and tracked with a translation state.
 */
export function ContentManager({ kind }: { kind: Kind }) {
  const queryClient = useQueryClient();
  const [draft, setDraft] = useState<Record<string, string>>({ ...emptyDraft });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState<"fa" | "en">("fa");

  const items = useQuery({
    queryKey: ["admin-content", kind],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("content_items")
        .select("*")
        .eq("kind", kind)
        .order("position", { ascending: true });
      if (error) throw new Error(error.message);
      return data;
    },
  });

  const save = useMutation({
    mutationFn: async () => {
      const payload = {
        kind,
        title_fa: draft["title_fa"] ?? "",
        title_en: draft["title_en"] || null,
        slug: draft["slug"] ?? "",
        summary_fa: draft["summary_fa"] || null,
        summary_en: draft["summary_en"] || null,
        body_fa: draft["body_fa"] || null,
        body_en: draft["body_en"] || null,
        seo_title: draft["seo_title"] || null,
        seo_description: draft["seo_description"] || null,
        status: (draft["status"] ?? "draft") as never,
        translation_state: (draft["translation_state"] ?? "missing") as never,
        no_index: draft["no_index"] === "true",
        published_at: draft["status"] === "published" ? new Date().toISOString() : null,
        fa_updated_at: new Date().toISOString(),
      };
      const { error } = editingId
        ? await supabase.from("content_items").update(payload).eq("id", editingId)
        : await supabase.from("content_items").insert(payload);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      setDraft({ ...emptyDraft });
      setEditingId(null);
      setOpen(false);
      void queryClient.invalidateQueries({ queryKey: ["admin-content", kind] });
    },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("content_items").delete().eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-content", kind] }),
  });

  function field(name: keyof typeof emptyDraft) {
    return {
      value: draft[name] ?? "",
      onChange: (event: { target: { value: string } }) =>
        setDraft({ ...draft, [name]: event.target.value }),
      className:
        "w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-brand",
    };
  }

  return (
    <>
      <PageHeader
        title={`مدیریت محتوا — ${label(contentKindLabels, kind).fa}`}
        description="فارسی مرجع است؛ نسخه انگلیسی اختیاری و وضعیت ترجمه‌اش جداگانه دنبال می‌شود."
        actions={
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setDraft({ ...emptyDraft });
              setOpen((value) => !value);
            }}
            className="rounded-md border border-border px-3 py-1.5 text-xs hover:bg-muted"
          >
            {open ? "بستن ویرایشگر" : "محتوای جدید"}
          </button>
        }
      />

      {open && (
        <Panel className="mb-6" title={editingId ? "ویرایش محتوا" : "محتوای جدید"}>
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
            <Labeled text={lang === "fa" ? "عنوان فارسی" : "English title"}>
              <input required={lang === "fa"} {...field(lang === "fa" ? "title_fa" : "title_en")} />
            </Labeled>
            <Labeled text="نشانی (slug)">
              <input required dir="ltr" {...field("slug")} />
            </Labeled>
            <Labeled text={lang === "fa" ? "خلاصه" : "Summary"} full>
              <textarea rows={3} {...field(lang === "fa" ? "summary_fa" : "summary_en")} />
            </Labeled>
            <Labeled text={lang === "fa" ? "متن کامل" : "Body"} full>
              <textarea rows={10} {...field(lang === "fa" ? "body_fa" : "body_en")} />
            </Labeled>
            <Labeled text="عنوان سئو">
              <input {...field("seo_title")} />
            </Labeled>
            <Labeled text="توضیح سئو">
              <input {...field("seo_description")} />
            </Labeled>
            <Labeled text="وضعیت">
              <select {...field("status")}>
                {Object.entries(contentStatusLabels).map(([value, item]) => (
                  <option key={value} value={value}>
                    {item.fa}
                  </option>
                ))}
              </select>
            </Labeled>
            <Labeled text="وضعیت ترجمه">
              <select {...field("translation_state")}>
                {Object.entries(translationStateLabels).map(([value, item]) => (
                  <option key={value} value={value}>
                    {item.fa}
                  </option>
                ))}
              </select>
            </Labeled>
            <Labeled text="عدم ایندکس (noindex)">
              <select {...field("no_index")}>
                <option value="false">خیر</option>
                <option value="true">بله</option>
              </select>
            </Labeled>

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
          rows={items.data ?? []}
          loading={items.isLoading}
          error={items.error}
          empty={{
            title: "هنوز محتوایی ثبت نشده",
            description: "با «محتوای جدید» اولین صفحه این بخش را بسازید.",
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
                        summary_fa: row.summary_fa ?? "",
                        summary_en: row.summary_en ?? "",
                        body_fa: row.body_fa ?? "",
                        body_en: row.body_en ?? "",
                        seo_title: row.seo_title ?? "",
                        seo_description: row.seo_description ?? "",
                        status: row.status,
                        translation_state: row.translation_state,
                        no_index: String(row.no_index),
                      });
                    }}
                  >
                    ویرایش
                  </button>
                  <button
                    type="button"
                    className="text-destructive"
                    onClick={() => {
                      if (confirm("این محتوا حذف شود؟")) remove.mutate(row.id);
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

function Labeled({
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
