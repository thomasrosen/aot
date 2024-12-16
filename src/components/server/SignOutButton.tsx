import { signOut } from "@/auth";
import { Icon } from "@/components/Icon";
import { Button } from "@/components/ui/button";
import { loadTranslations } from "@/lib/server/fluent-server";
import { Locale } from "@@/i18n-config";

export function SignOutButton({ locale }: { locale: Locale }) {
  const t = loadTranslations(locale);
  return (
    <Button
      variant="outline"
      onClick={async () => {
        "use server";
        await signOut();
      }}
    >
      <Icon name="logout" />
      {t("sign-out")}
    </Button>
  );
}
