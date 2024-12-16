import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { loadTranslations } from "@/lib/server/fluent-server";
import { Locale } from "@@/i18n-config";
import Link from "next/link";

export function NavMenu({
  isAdmin,
  locale,
}: {
  isAdmin: boolean;
  locale: Locale;
}) {
  const t = loadTranslations(locale);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">{t("menu")}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuLabel>{t("menu")}</DropdownMenuLabel>
        {/* <Link href="/">
          <DropdownMenuItem>{t("startpage")}</DropdownMenuItem>
        </Link> */}
        <Link href="/objects">
          <DropdownMenuItem>{t("objects")}</DropdownMenuItem>
        </Link>
        <Link href="/about">
          <DropdownMenuItem>{t("about")}</DropdownMenuItem>
        </Link>
        <Link href="/about/stats">
          <DropdownMenuItem>{t("statistics")}</DropdownMenuItem>
        </Link>

        {isAdmin ? (
          <>
            <DropdownMenuSeparator />

            <DropdownMenuLabel>{t("admin-menu")}</DropdownMenuLabel>
            <Link href="/users">
              <DropdownMenuItem>{t("users")}</DropdownMenuItem>
            </Link>
            <Link href="/roles">
              <DropdownMenuItem>{t("roles")}</DropdownMenuItem>
            </Link>
            <Link href="/permissions">
              <DropdownMenuItem>{t("permissions")}</DropdownMenuItem>
            </Link>
          </>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
