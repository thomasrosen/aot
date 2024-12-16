"use client";

import { Icon } from "@/components/Icon";
import { SelectTriggerIcon } from "@/components/client/SelectTriggerIcon";
import { Select, SelectContent, SelectItem } from "@/components/ui/select";
import { useTheme } from "next-themes";
import { useTranslations } from "./Translation";

export function ModeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const t = useTranslations();

  return (
    <Select onValueChange={setTheme} defaultValue={theme || ""}>
      <SelectTriggerIcon
        title={t("change-theme")}
        data-placeholder={t("change-theme")}
      >
        {resolvedTheme === "light" ? (
          <Icon name="light_mode" />
        ) : (
          <Icon name="dark_mode" />
        )}
      </SelectTriggerIcon>
      <SelectContent>
        <SelectItem value="light">{t("light-theme")}</SelectItem>
        <SelectItem value="dark">{t("dark-theme")}</SelectItem>
        <SelectItem value="system">{t("system-theme")}</SelectItem>
      </SelectContent>
    </Select>
  );
}
