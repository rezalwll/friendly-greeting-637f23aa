// Persian labels + tone for every internal status enum used across the
// client dashboard and the admin panel.

export type Tone = "neutral" | "info" | "progress" | "warning" | "success" | "danger";

type Dict = Record<string, { fa: string; tone: Tone }>;

export const projectStatusLabels: Dict = {
  planning: { fa: "برنامه‌ریزی", tone: "info" },
  design: { fa: "طراحی", tone: "progress" },
  development: { fa: "توسعه", tone: "progress" },
  testing: { fa: "تست", tone: "progress" },
  waiting_client: { fa: "در انتظار مشتری", tone: "warning" },
  completed: { fa: "تکمیل‌شده", tone: "success" },
  paused: { fa: "متوقف", tone: "neutral" },
};

export const milestoneKindLabels: Dict = {
  discovery: { fa: "کشف و تحلیل", tone: "info" },
  structure: { fa: "ساختار", tone: "info" },
  design: { fa: "طراحی", tone: "info" },
  development: { fa: "توسعه", tone: "info" },
  testing: { fa: "تست", tone: "info" },
  launch: { fa: "انتشار", tone: "info" },
};

export const milestoneStatusLabels: Dict = {
  pending: { fa: "شروع‌نشده", tone: "neutral" },
  in_progress: { fa: "در حال انجام", tone: "progress" },
  waiting_approval: { fa: "در انتظار تأیید مشتری", tone: "warning" },
  completed: { fa: "تکمیل‌شده", tone: "success" },
  skipped: { fa: "حذف‌شده", tone: "neutral" },
};

export const fileCategoryLabels: Dict = {
  contract: { fa: "قرارداد", tone: "neutral" },
  design: { fa: "طراحی", tone: "neutral" },
  content: { fa: "محتوا", tone: "neutral" },
  deliverable: { fa: "تحویل‌شدنی", tone: "neutral" },
  invoice: { fa: "صورتحساب", tone: "neutral" },
  technical: { fa: "فنی", tone: "neutral" },
  other: { fa: "سایر", tone: "neutral" },
};

export const leadTypeLabels: Dict = {
  project_request: { fa: "درخواست پروژه", tone: "info" },
  technical_review: { fa: "بررسی فنی", tone: "info" },
  seo_audit: { fa: "ممیزی سئو", tone: "info" },
  contact: { fa: "تماس", tone: "neutral" },
};

export const leadStatusLabels: Dict = {
  new: { fa: "جدید", tone: "info" },
  reviewing: { fa: "در حال بررسی", tone: "progress" },
  need_info: { fa: "نیاز به اطلاعات", tone: "warning" },
  contacted: { fa: "تماس گرفته شد", tone: "progress" },
  qualified: { fa: "واجد شرایط", tone: "progress" },
  proposal: { fa: "پیشنهاد", tone: "progress" },
  proposal_sent: { fa: "پیشنهاد ارسال شد", tone: "progress" },
  approved: { fa: "تأییدشده", tone: "success" },
  won: { fa: "برنده", tone: "success" },
  rejected: { fa: "ردشده", tone: "danger" },
  lost: { fa: "از دست رفته", tone: "danger" },
  converted: { fa: "تبدیل به پروژه", tone: "success" },
  archived: { fa: "بایگانی", tone: "neutral" },
};

export const invoiceStatusLabels: Dict = {
  draft: { fa: "پیش‌نویس", tone: "neutral" },
  issued: { fa: "صادرشده", tone: "info" },
  partially_paid: { fa: "پرداخت جزئی", tone: "progress" },
  paid: { fa: "پرداخت‌شده", tone: "success" },
  cancelled: { fa: "لغوشده", tone: "neutral" },
};

export const installmentStatusLabels: Dict = {
  upcoming: { fa: "پیش‌رو", tone: "neutral" },
  due: { fa: "سررسید", tone: "warning" },
  paid: { fa: "پرداخت‌شده", tone: "success" },
  overdue: { fa: "معوق", tone: "danger" },
  cancelled: { fa: "لغوشده", tone: "neutral" },
};

export const ticketStatusLabels: Dict = {
  open: { fa: "باز", tone: "info" },
  in_progress: { fa: "در حال بررسی", tone: "progress" },
  waiting_customer: { fa: "در انتظار مشتری", tone: "warning" },
  resolved: { fa: "حل‌شده", tone: "success" },
  closed: { fa: "بسته", tone: "neutral" },
};

export const ticketCategoryLabels: Dict = {
  technical: { fa: "فنی", tone: "neutral" },
  billing: { fa: "مالی", tone: "neutral" },
  project: { fa: "پروژه", tone: "neutral" },
  seo: { fa: "سئو", tone: "neutral" },
  other: { fa: "سایر", tone: "neutral" },
};

export const ticketPriorityLabels: Dict = {
  normal: { fa: "عادی", tone: "neutral" },
  high: { fa: "بالا", tone: "warning" },
  urgent: { fa: "فوری", tone: "danger" },
};

export const contentStatusLabels: Dict = {
  draft: { fa: "پیش‌نویس", tone: "neutral" },
  review: { fa: "بازبینی", tone: "progress" },
  scheduled: { fa: "زمان‌بندی‌شده", tone: "info" },
  published: { fa: "منتشرشده", tone: "success" },
  archived: { fa: "بایگانی", tone: "neutral" },
};

export const translationStateLabels: Dict = {
  missing: { fa: "ترجمه ندارد", tone: "danger" },
  draft: { fa: "پیش‌نویس ترجمه", tone: "warning" },
  complete: { fa: "کامل", tone: "success" },
  needs_update: { fa: "نیاز به بروزرسانی", tone: "warning" },
};

export const messageStatusLabels: Dict = {
  new: { fa: "جدید", tone: "info" },
  read: { fa: "خوانده‌شده", tone: "neutral" },
  replied: { fa: "پاسخ داده شد", tone: "success" },
  archived: { fa: "بایگانی", tone: "neutral" },
};

export const roleLabels: Dict = {
  super_admin: { fa: "مدیر ارشد", tone: "danger" },
  admin: { fa: "مدیر", tone: "warning" },
  support: { fa: "پشتیبانی", tone: "info" },
  editor: { fa: "نویسنده/ویراستار", tone: "info" },
  customer: { fa: "مشتری", tone: "neutral" },
};

export const contentKindLabels: Dict = {
  service: { fa: "خدمات", tone: "neutral" },
  solution: { fa: "راه‌حل‌ها", tone: "neutral" },
  problem: { fa: "مشکلات", tone: "neutral" },
  industry: { fa: "صنایع", tone: "neutral" },
  integration: { fa: "یکپارچه‌سازی‌ها", tone: "neutral" },
  case_study: { fa: "نمونه‌کارها", tone: "neutral" },
};

export function label(dict: Dict, key: string | null | undefined) {
  if (!key) return { fa: "—", tone: "neutral" as Tone };
  return dict[key] ?? { fa: key, tone: "neutral" as Tone };
}

const faDate = new Intl.DateTimeFormat("fa-IR", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

export function formatDate(value: string | null | undefined) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return faDate.format(date);
}

export function formatDateTime(value: string | null | undefined) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return `${faDate.format(date)} — ${date.toLocaleTimeString("fa-IR", {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
}

export function formatAmount(value: number | null | undefined, currency = "IRT") {
  if (value == null) return "—";
  const formatted = new Intl.NumberFormat("fa-IR").format(value);
  return currency === "IRT" ? `${formatted} تومان` : `${formatted} ${currency}`;
}
