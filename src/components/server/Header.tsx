import { auth } from "@/auth";
import { AdminMenu } from "@/components/AdminMenu";
import { Icon } from "@/components/Icon";
import { H1 } from "@/components/Typography";
import { Button } from "@/components/ui/button";
import { userHasOneOfPermissions } from "@/lib/server/permissions";
import Link from "next/link";

export async function Header() {
  const session = await auth();
  const isSignedIn = !!session?.user?.id;
  const isAdmin = await userHasOneOfPermissions({
    userId: session?.user?.id,
    permissionNames: ["admin"],
  });

  return (
    <header className="sticky top-0 bg-background text-foreground border-b flex h-16 justify-between items-center px-4 gap-4">
      <Link href="/" className="shrink-0">
        <H1 className="text-lg lg:text-2xl">Inventory</H1>
      </Link>
      <nav className="w-full">{isAdmin ? <AdminMenu /> : null}</nav>
      <div className="flex gap-4 shrink-0">
        {isSignedIn ? (
          <>
            <Link href="/api/auth/signout">
              <Button variant="ghost">
                <Icon name="logout" /> Sign Out
              </Button>
            </Link>
          </>
        ) : (
          <Link href="/api/auth/signin">
            <Button variant="ghost">
              <Icon name="login" /> Sign In
            </Button>
          </Link>
        )}
      </div>
    </header>
  );
}
