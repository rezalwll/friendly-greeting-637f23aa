import { useRouterState } from "@tanstack/react-router";

export type Locale = "fa" | "en";

/** Persian is the primary locale; English lives under the /en prefix. */
export function isEnglishPath(pathname: string) {
  return pathname === "/en" || pathname.startsWith("/en/");
}

export function useLocale(): Locale {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return isEnglishPath(pathname) ? "en" : "fa";
}

export function dirFor(locale: Locale) {
  return locale === "en" ? "ltr" : "rtl";
}

/** Map the current path to its counterpart in the other locale. */
export function counterpartPath(pathname: string) {
  if (isEnglishPath(pathname)) {
    const rest = pathname.slice(3);
    return rest === "" || rest === "/" ? "/" : rest;
  }
  return pathname === "/" ? "/en" : `/en${pathname}`;
}

/** Pick a localized field, falling back to Persian when a translation is missing. */
export function pick(locale: Locale, fa: string | null, en: string | null): string {
  if (locale === "en") return (en?.trim() || fa?.trim() || "") as string;
  return (fa?.trim() || en?.trim() || "") as string;
}
