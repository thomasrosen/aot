import { auth } from "@/auth";
import { NavMenu } from "@/components/NavMenu";
import { H1 } from "@/components/Typography";
import { LocaleSwitcher } from "@/components/client/LocaleSwitcher";
import { ModeToggle } from "@/components/client/ModeToggle";
import { SignInButton } from "@/components/server/SignInButton";
import { SignOutButton } from "@/components/server/SignOutButton";
import { loadTranslations } from "@/lib/server/fluent-server";
import { getLocale } from "@/lib/server/getLocale";
import { userHasOneOfPermissions } from "@/lib/server/permissions";
import Link from "next/link";
import { Icon } from "../Icon";

export async function Header() {
  const session = await auth();
  const isSignedIn = !!session?.user?.id;
  const isAdmin = await userHasOneOfPermissions({
    userId: session?.user?.id,
    permissionNames: ["admin"],
  });

  const locale = await getLocale();
  const t = await loadTranslations(locale);

  return (
    <header className="sticky top-0 bg-background text-foreground border-b z-20">
      <div className="w-content max-w-full mx-auto px-8 flex gap-4 items-center justify-between h-16">
        <Link href="/" className="shrink-0 inline-flex items-center gap-2">
          <Icon name="inventory_2" />
          <H1 className="text-lg lg:text-2xl">{t("app-title")}</H1>
        </Link>
        <nav className="w-full">
          <NavMenu isAdmin={isAdmin} locale={locale} />
        </nav>
        <div className="flex gap-2 shrink-0">
          {isSignedIn ? (
            <SignOutButton locale={locale} />
          ) : (
            <SignInButton locale={locale} />
          )}
          <LocaleSwitcher />
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
