import { DEFAULT_LOCALE, Locale, SUPPORTED_LOCALES } from "@@/i18n-config";
import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import type { NextRequest } from "next/server";

// // Mock database function to fetch user settings
// async function fetchUserLocaleSetting(
//   req: NextRequest
// ): Promise<Locale | null> {
//   return DEFAULT_LOCALE;
//   // // Replace with your actual database query logic
//   // const mockDatabase: Record<string, { locale: Locale }> = {
//   //   "user-session-1": { locale: "fr" },
//   //   "user-session-2": { locale: "es" },
//   // };

//   // return userSession ? mockDatabase[userSession] || null : null;
// }

function matchLocale(acceptLanguage?: string): Locale {
  const languages = new Negotiator({
    headers: { "accept-language": acceptLanguage },
  }).languages();
  return match(languages, SUPPORTED_LOCALES, DEFAULT_LOCALE) as Locale;
}

export async function getLocale(req: NextRequest): Promise<Locale> {
  // Extract cookies
  const localeCookie = req.cookies.get("locale")?.value as Locale | undefined;

  let locale: Locale | undefined | null = localeCookie;

  // // Fallback to fetching user settings from the database if no cookie is found
  // if (!locale) {
  //   locale = await fetchUserLocaleSetting(req);
  // }

  // Fallback to detecting from Accept-Language header
  if (!locale) {
    const acceptLanguage = req.headers.get("accept-language") || "";
    locale = matchLocale(acceptLanguage);
  }

  // Validate locale
  if (!locale || !SUPPORTED_LOCALES.includes(locale || DEFAULT_LOCALE)) {
    locale = DEFAULT_LOCALE;
  }

  return locale;
}
