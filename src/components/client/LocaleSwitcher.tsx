"use client";

import { Icon } from "@/components/Icon";
import { SelectTriggerIcon } from "@/components/client/SelectTriggerIcon";
import { useLocale, useTranslations } from "@/components/client/Translation";
import { Select, SelectContent, SelectItem } from "@/components/ui/select";
import { SUPPORTED_LOCALES } from "@@/i18n-config";
import { useRouter } from "next/navigation";

export function LocaleSwitcher() {
  const router = useRouter();
  const t = useTranslations();
  const locale = useLocale();

  const switchLocale = (new_locale: string) => {
    document.cookie = `locale=${new_locale}; path=/; max-age=31536000`; // Persist for 1 year
    router.refresh(); // Refresh the page to apply the new locale
  };

  return (
    <Select onValueChange={switchLocale} defaultValue={locale}>
      <SelectTriggerIcon title={t("change-language")}>
        <Icon name="globe" />
      </SelectTriggerIcon>
      <SelectContent>
        {SUPPORTED_LOCALES.map((locale) => {
          const displayNames = new Intl.DisplayNames([locale], {
            type: "language",
          });

          return (
            <SelectItem key={locale} value={locale}>
              {displayNames.of(locale)}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
