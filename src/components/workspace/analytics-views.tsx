import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/workspace/shell";
import { DataTable, EmptyState, LoadingState, Metric, Panel } from "@/components/workspace/states";

export type AnalyticsSection =
  | "overview"
  | "acquisition"
  | "pages"
  | "behavior"
  | "journeys"
  | "conversions"
  | "forms"
  | "search"
  | "services"
  | "industries";

type EventRow = {
  id: number;
  event_name: string;
  path: string | null;
  page_type: string | null;
  label: string | null;
  locale: string | null;
  session_id: string | null;
  value: number | null;
  created_at: string;
  metadata: unknown;
};

const meta: Record<AnalyticsSection, { title: string; description: string }> = {
  overview: {
    title: "تحلیل داخلی — نمای کلی",
    description: "همه اعداد از رویدادهای ثبت‌شده در پایگاه‌داده خودِ رای‌کد می‌آید؛ هیچ ابزار تحلیلی بیرونی متصل نیست.",
  },
  acquisition: { title: "جذب", description: "مسیر ورود کاربران بر اساس صفحه فرود و زبان." },
  pages: { title: "صفحه‌ها", description: "پربازدیدترین صفحه‌ها و نوع محتوای آن‌ها." },
  behavior: { title: "رفتار", description: "کلیک‌ها، بازشدن بخش‌ها و تعامل‌های ثبت‌شده." },
  journeys: { title: "مسیرها", description: "ترتیب صفحه‌های بازدیدشده در هر نشست." },
  conversions: { title: "تبدیل‌ها", description: "رویدادهای منجر به ثبت درخواست یا ثبت‌نام." },
  forms: { title: "فرم‌ها", description: "شروع، رهاکردن و ارسال فرم‌ها. محتوای فرم ذخیره نمی‌شود." },
  search: { title: "جست‌وجوی داخلی", description: "عبارت‌های جست‌وجوشده در خود سایت." },
  services: { title: "خدمات", description: "میزان توجه به هر خدمت." },
  industries: { title: "صنایع", description: "میزان توجه به هر صنعت." },
};

const filters: Record<AnalyticsSection, (row: EventRow) => boolean> = {
  overview: () => true,
  acquisition: (row) => row.event_name === "page_view",
  pages: (row) => row.event_name === "page_view",
  behavior: (row) => row.event_name.startsWith("click_") || row.event_name.startsWith("open_"),
  journeys: (row) => row.event_name === "page_view",
  conversions: (row) =>
    ["lead_submitted", "register", "login", "cta_click"].includes(row.event_name),
  forms: (row) => row.event_name.startsWith("form_"),
  search: (row) => row.event_name === "internal_search",
  services: (row) => row.page_type === "service",
  industries: (row) => row.page_type === "industry",
};

export function AnalyticsView({ section }: { section: AnalyticsSection }) {
  const [days, setDays] = useState(30);

  const events = useQuery({
    queryKey: ["analytics-events", days],
    queryFn: async () => {
      const since = new Date(Date.now() - days * 86_400_000).toISOString();
      const { data, error } = await supabase
        .from("analytics_events")
        .select("*")
        .gte("created_at", since)
        .order("created_at", { ascending: false })
        .limit(5000);
      if (error) throw new Error(error.message);
      return data as unknown as EventRow[];
    },
  });

  const all = events.data ?? [];
  const rows = all.filter(filters[section]);
  const info = meta[section];

  const sessions = new Set(rows.map((row) => row.session_id).filter(Boolean)).size;
  const users = new Set(rows.map((row) => (row as { user_id?: string }).user_id).filter(Boolean))
    .size;

  const byPath = rank(rows, (row) => row.path ?? "—");
  const byEvent = rank(rows, (row) => row.event_name);
  const byLabel = rank(rows, (row) => row.label ?? "—");
  const byLocale = rank(rows, (row) => row.locale ?? "—");

  return (
    <>
      <PageHeader
        title={info.title}
        description={info.description}
        actions={
          <select
            value={days}
            onChange={(event) => setDays(Number(event.target.value))}
            className="rounded-md border border-input bg-background px-3 py-1.5 text-xs"
          >
            <option value={7}>۷ روز اخیر</option>
            <option value={30}>۳۰ روز اخیر</option>
            <option value={90}>۹۰ روز اخیر</option>
          </select>
        }
      />

      {events.isLoading ? (
        <LoadingState rows={4} />
      ) : rows.length === 0 ? (
        <EmptyState
          title="هنوز داده‌ای برای این بازه ثبت نشده"
          description="با بازدید واقعی کاربران از سایت، رویدادها در پایگاه‌داده داخلی ثبت و همین‌جا نمایش داده می‌شوند."
        />
      ) : (
        <>
          <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Metric label="رویدادها" value={rows.length} />
            <Metric label="نشست‌ها" value={sessions} />
            <Metric label="کاربران شناخته‌شده" value={users} />
            <Metric label="بازه" value={`${days} روز`} />
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <RankPanel title="پرتکرارترین صفحه‌ها" rows={byPath} />
            <RankPanel title="پرتکرارترین رویدادها" rows={byEvent} />
            <RankPanel title="برچسب‌ها" rows={byLabel} />
            <RankPanel title="زبان" rows={byLocale} />
          </div>
        </>
      )}
    </>
  );
}

function rank(rows: EventRow[], pick: (row: EventRow) => string) {
  const map = new Map<string, number>();
  for (const row of rows) {
    const key = pick(row);
    map.set(key, (map.get(key) ?? 0) + 1);
  }
  return [...map.entries()]
    .map(([id, count]) => ({ id, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 15);
}

function RankPanel({ title, rows }: { title: string; rows: { id: string; count: number }[] }) {
  return (
    <Panel title={title}>
      <DataTable
        rows={rows}
        empty={{ title: "داده‌ای نیست" }}
        columns={[
          { key: "id", header: "مورد", cell: (row) => row.id },
          { key: "count", header: "تعداد", cell: (row) => row.count, className: "w-24" },
        ]}
      />
    </Panel>
  );
}
