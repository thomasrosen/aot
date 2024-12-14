import { auth } from "@/auth";
import { Icon } from "@/components/Icon";
import { NavMenu } from "@/components/NavMenu";
import { H1 } from "@/components/Typography";
import { ModeToggle } from "@/components/client/ModeToggle";
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
    <header className="sticky top-0 bg-background text-foreground border-b flex h-16 justify-between items-center px-4 gap-4 z-20">
      <Link href="/" className="shrink-0">
        <H1 className="text-lg lg:text-2xl">Inventory</H1>
      </Link>
      <nav className="w-full">
        <NavMenu isAdmin={isAdmin} />
      </nav>
      <div className="flex gap-2 shrink-0">
        {isSignedIn ? (
          <>
            <Link href="/api/auth/signout">
              <Button variant="outline">
                <Icon name="logout" /> Sign Out
              </Button>
            </Link>
          </>
        ) : (
          <Link href="/api/auth/signin">
            <Button variant="outline">
              <Icon name="login" /> Sign In
            </Button>
          </Link>
        )}
        <ModeToggle />
      </div>
    </header>
  );
}
