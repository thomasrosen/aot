export const i18n = {
  defaultLocale: "en-GB",
  locales: ["en-GB", "de-DE"],
} as const;

export const DEFAULT_LOCALE = i18n.defaultLocale;
export const SUPPORTED_LOCALES = i18n.locales;

export type Locale = (typeof i18n)["locales"][number];
