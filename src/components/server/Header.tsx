import { auth } from "@/auth";
import { NavMenu } from "@/components/NavMenu";
import { H1 } from "@/components/Typography";
import { LocaleSwitcher } from "@/components/client/LocaleSwitcher";
import { ModeToggle } from "@/components/client/ModeToggle";
import { SignInButton } from "@/components/server/SignInButton";
import { SignOutButton } from "@/components/server/SignOutButton";
import { loadTranslations } from "@/lib/server/fluent-server";
import { userHasOneOfPermissions } from "@/lib/server/permissions";
import { Locale } from "@@/i18n-config";
import Link from "next/link";

export async function Header({ locale }: { locale: Locale }) {
  const session = await auth();
  const isSignedIn = !!session?.user?.id;
  const isAdmin = await userHasOneOfPermissions({
    userId: session?.user?.id,
    permissionNames: ["admin"],
  });

  const t = await loadTranslations(locale);

  return (
    <header className="sticky top-0 bg-background text-foreground border-b flex h-16 justify-between items-center px-4 gap-4 z-20">
      <Link href="/" className="shrink-0">
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
    </header>
  );
}
