import { Locale } from "@@/i18n-config";
import { FluentBundle, FluentResource } from "@fluent/bundle";

import de_DE from "@/locales/de-DE.ftl";
import en_GB from "@/locales/en-GB.ftl";

const bundleCache: Map<Locale, FluentBundle> = new Map();

export function loadMessages(locale: Locale): string | null {
  if (locale === "en-GB") {
    return en_GB;
  }
  if (locale === "de-DE") {
    return de_DE;
  }

  return null;
}

type loadFluentBundleReturnType = (
  id: string,
  args?: Record<string, string>
) => string;

export function loadTranslations(locale: Locale): loadFluentBundleReturnType {
  if (!bundleCache.has(locale)) {
    const bundle = new FluentBundle(locale);

    const messages = loadMessages(locale);
    if (messages) {
      bundle.addResource(new FluentResource(messages));
    }

    bundleCache.set(locale, bundle);
  }

  return (id: string, args: Record<string, string> = {}) =>
    getTranslation(bundleCache.get(locale), id, args);
}

export function getTranslation(
  bundle?: FluentBundle,
  id?: string,
  args: Record<string, string> = {}
): string {
  if (!bundle) {
    return `Missing bundle: ${id}`;
  }
  if (!id) {
    return `Missing id: ${id}`;
  }
  const message = bundle.getMessage(id);
  if (!message) return `Missing translation: ${id}`;
  return bundle.formatPattern(message.value || "", args);
}
