import { Icon } from "@/components/Icon";
import { Button } from "@/components/ui/button";
import { loadTranslations } from "@/lib/server/fluent-server";
import { Locale } from "@@/i18n-config";
import Link from "next/link";

export function SignInButton({ locale }: { locale: Locale }) {
  const t = loadTranslations(locale);
  return (
    <Link href="/api/auth/signin">
      <Button variant="outline">
        <Icon name="login" />
        {t("sign-in")}
      </Button>
    </Link>
  );
}
