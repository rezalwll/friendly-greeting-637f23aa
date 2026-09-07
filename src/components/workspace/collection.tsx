import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import type { ReactNode } from "react";

import { supabase } from "@/integrations/supabase/client";
import { DataTable, EmptyState, Panel, type Column } from "@/components/workspace/states";

export type FieldType = "text" | "textarea" | "number" | "select" | "boolean";

export type FieldDef = {
  name: string;
  label: string;
  type?: FieldType;
  options?: { value: string; label: string }[];
  required?: boolean;
  help?: string;
};

type Row = Record<string, unknown> & { id: string };

/**
 * Generic internal management surface for a database table: list, create,
 * inline edit and delete. Used by the simpler admin/CMS screens.
 */
export function Collection({
  table,
  title,
  description,
  fields,
  columns,
  orderBy = "created_at",
  ascending = false,
  emptyTitle,
  emptyDescription,
  extra,
}: {
  table: string;
  title: string;
  description?: string;
  fields: FieldDef[];
  columns: Column<Row>[];
  orderBy?: string;
  ascending?: boolean;
  emptyTitle: string;
  emptyDescription?: string;
  extra?: ReactNode;
}) {
  const queryClient = useQueryClient();
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [editing, setEditing] = useState<Row | null>(null);
  const [open, setOpen] = useState(false);

  const list = useQuery({
    queryKey: ["admin", table, orderBy],
    queryFn: async () => {
      const { data, error } = await supabase
        .from(table as never)
        .select("*")
        .order(orderBy, { ascending });
      if (error) throw new Error(error.message);
      return (data ?? []) as unknown as Row[];
    },
  });

  const save = useMutation({
    mutationFn: async () => {
      const payload: Record<string, unknown> = {};
      for (const field of fields) {
        const value = draft[field.name];
        if (value === undefined) continue;
        if (field.type === "number") payload[field.name] = value === "" ? null : Number(value);
        else if (field.type === "boolean") payload[field.name] = value === "true";
        else payload[field.name] = value === "" ? null : value;
      }
      const query = editing
        ? supabase.from(table as never).update(payload as never).eq("id", editing.id)
        : supabase.from(table as never).insert(payload as never);
      const { error } = await query;
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      setDraft({});
      setEditing(null);
      setOpen(false);
      void queryClient.invalidateQueries({ queryKey: ["admin", table] });
    },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from(table as never).delete().eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", table] }),
  });

  function startEdit(row: Row) {
    const next: Record<string, string> = {};
    for (const field of fields) {
      const value = row[field.name];
      next[field.name] = value == null ? "" : String(value);
    }
    setDraft(next);
    setEditing(row);
    setOpen(true);
  }

  const actionColumn: Column<Row> = {
    key: "actions",
    header: "",
    cell: (row) => (
      <div className="flex gap-2 text-xs">
        <button type="button" onClick={() => startEdit(row)} className="text-brand">
          ویرایش
        </button>
        <button
          type="button"
          onClick={() => {
            if (confirm("این رکورد حذف شود؟")) remove.mutate(row.id);
          }}
          className="text-destructive"
        >
          حذف
        </button>
      </div>
    ),
  };

  return (
    <Panel
      title={title}
      description={description}
      action={
        <button
          type="button"
          onClick={() => {
            setEditing(null);
            setDraft({});
            setOpen((value) => !value);
          }}
          className="rounded-md border border-border px-3 py-1.5 text-xs hover:bg-muted"
        >
          {open ? "بستن فرم" : "افزودن"}
        </button>
      }
    >
      {extra}

      {open && (
        <form
          className="mb-6 grid gap-3 rounded-lg border border-border p-4 md:grid-cols-2"
          onSubmit={(event) => {
            event.preventDefault();
            save.mutate();
          }}
        >
          {fields.map((field) => (
            <label
              key={field.name}
              className={field.type === "textarea" ? "block md:col-span-2" : "block"}
            >
              <span className="mb-1 block text-xs text-muted-foreground">{field.label}</span>
              {field.type === "textarea" ? (
                <textarea
                  rows={4}
                  required={field.required}
                  value={draft[field.name] ?? ""}
                  onChange={(event) =>
                    setDraft({ ...draft, [field.name]: event.target.value })
                  }
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-brand"
                />
              ) : field.type === "select" || field.type === "boolean" ? (
                <select
                  value={draft[field.name] ?? ""}
                  onChange={(event) => setDraft({ ...draft, [field.name]: event.target.value })}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-brand"
                >
                  <option value="">—</option>
                  {(field.type === "boolean"
                    ? [
                        { value: "true", label: "بله" },
                        { value: "false", label: "خیر" },
                      ]
                    : (field.options ?? [])
                  ).map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type === "number" ? "number" : "text"}
                  required={field.required}
                  value={draft[field.name] ?? ""}
                  onChange={(event) => setDraft({ ...draft, [field.name]: event.target.value })}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-brand"
                />
              )}
              {field.help && (
                <span className="mt-1 block text-[11px] text-muted-foreground">{field.help}</span>
              )}
            </label>
          ))}

          <div className="md:col-span-2 flex items-center gap-3">
            <button
              type="submit"
              disabled={save.isPending}
              className="rounded-md bg-foreground px-4 py-2 text-sm text-background disabled:opacity-60"
            >
              {save.isPending ? "در حال ذخیره…" : editing ? "بروزرسانی" : "ثبت"}
            </button>
            {save.isError && (
              <span className="text-xs text-destructive">
                ذخیره انجام نشد: {(save.error as Error).message}
              </span>
            )}
          </div>
        </form>
      )}

      {list.data && list.data.length === 0 && !open ? (
        <EmptyState title={emptyTitle} description={emptyDescription} />
      ) : (
        <DataTable
          rows={list.data}
          loading={list.isLoading}
          error={list.error}
          empty={{ title: emptyTitle, description: emptyDescription }}
          columns={[...columns, actionColumn]}
        />
      )}
    </Panel>
  );
}
