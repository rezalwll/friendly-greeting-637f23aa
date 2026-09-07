import type { LinkProps } from "@tanstack/react-router";

export type To = Exclude<LinkProps["to"], undefined>;

export type NavItem = { label: string; to: To; exact?: boolean };
export type NavGroup = { label?: string; items: NavItem[] };

export const dashboardNav: NavGroup[] = [
  {
    items: [
      { label: "نمای کلی", to: "/dashboard", exact: true },
      { label: "پروژه‌ها", to: "/dashboard/projects" },
      { label: "درخواست‌ها", to: "/dashboard/requests" },
      { label: "پرداخت‌ها", to: "/dashboard/payments" },
      { label: "فایل‌ها", to: "/dashboard/files" },
      { label: "پشتیبانی", to: "/dashboard/support" },
      { label: "اعلان‌ها", to: "/dashboard/notifications" },
      { label: "پروفایل", to: "/dashboard/profile" },
    ],
  },
];

export const adminNav: NavGroup[] = [
  {
    label: "کلی",
    items: [{ label: "داشبورد مدیریت", to: "/admin", exact: true }],
  },
  {
    label: "تحلیل داخلی",
    items: [
      { label: "نمای کلی", to: "/admin/analytics" },
      { label: "جذب", to: "/admin/analytics/acquisition" },
      { label: "صفحه‌ها", to: "/admin/analytics/pages" },
      { label: "رفتار", to: "/admin/analytics/behavior" },
      { label: "مسیرها", to: "/admin/analytics/journeys" },
      { label: "تبدیل‌ها", to: "/admin/analytics/conversions" },
      { label: "فرم‌ها", to: "/admin/analytics/forms" },
      { label: "جست‌وجو", to: "/admin/analytics/search" },
      { label: "خدمات", to: "/admin/analytics/services" },
      { label: "صنایع", to: "/admin/analytics/industries" },
    ],
  },
  {
    label: "کسب‌وکار",
    items: [
      { label: "سرنخ‌ها", to: "/admin/leads" },
      { label: "مشتریان", to: "/admin/customers" },
      { label: "پروژه‌ها", to: "/admin/projects" },
    ],
  },
  {
    label: "مالی",
    items: [
      { label: "صورتحساب‌ها", to: "/admin/invoices" },
      { label: "پرداخت‌ها", to: "/admin/payments" },
      { label: "اقساط", to: "/admin/installments" },
    ],
  },
  {
    label: "پشتیبانی",
    items: [
      { label: "تیکت‌ها", to: "/admin/tickets" },
      { label: "پیام‌ها", to: "/admin/messages" },
    ],
  },
  {
    label: "محتوا",
    items: [
      { label: "مقاله‌ها", to: "/admin/articles" },
      { label: "خدمات", to: "/admin/content/service" },
      { label: "راه‌حل‌ها", to: "/admin/content/solution" },
      { label: "مشکلات", to: "/admin/content/problem" },
      { label: "صنایع", to: "/admin/content/industry" },
      { label: "یکپارچه‌سازی‌ها", to: "/admin/content/integration" },
      { label: "نمونه‌کارها", to: "/admin/content/case_study" },
      { label: "پرسش‌های متداول", to: "/admin/faqs" },
      { label: "نویسندگان", to: "/admin/authors" },
      { label: "دسته‌ها", to: "/admin/categories" },
      { label: "برچسب‌ها", to: "/admin/tags" },
    ],
  },
  {
    label: "سئو",
    items: [
      { label: "متادیتا", to: "/admin/seo/metadata" },
      { label: "ریدایرکت‌ها", to: "/admin/seo/redirects" },
      { label: "سلامت محتوا", to: "/admin/seo/health" },
    ],
  },
  {
    label: "سیستم",
    items: [
      { label: "کاربران", to: "/admin/users" },
      { label: "نقش‌ها", to: "/admin/roles" },
      { label: "گزارش فعالیت", to: "/admin/logs" },
      { label: "تنظیمات سایت", to: "/admin/settings" },
    ],
  },
];
