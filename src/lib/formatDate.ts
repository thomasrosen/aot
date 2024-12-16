import { DEFAULT_LOCALE } from "@@/i18n-config";

export function formatDate(
  date: Date | string | undefined,
  locale: string = DEFAULT_LOCALE
) {
  if (!date) {
    return "";
  }

  if (typeof date === "string") {
    date = new Date(date);
  }

  if (isNaN(date.getTime())) {
    return "";
  }

  // return localized date
  return new Intl.DateTimeFormat(locale).format(date);
}

export function formatDateRange(
  from: Date,
  to: Date,
  locale: string = DEFAULT_LOCALE
) {
  locale = "de-DE";
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).formatRange(from, to);
}
