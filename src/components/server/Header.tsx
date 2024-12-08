import { auth } from "@/auth";
import { AdminMenu } from "@/components/AdminMenu";
import { Icon } from "@/components/Icon";
import { H1 } from "@/components/Typography";
import { CreateObjectButton } from "@/components/client/CreateObjectButton";
import { Button } from "@/components/ui/button";
import { userHasOneOfPermissions } from "@/lib/permissions";
import Link from "next/link";
import { Suspense } from "react";

export async function Header() {
  const session = await auth();
  const isSignedIn = !!session?.user?.id;
  const canCreateObject = await userHasOneOfPermissions({
    userId: session?.user?.id,
    permissionNames: ["create_objects"],
  });

  const isAdmin = await userHasOneOfPermissions({
    userId: session?.user?.id,
    permissionNames: ["admin"],
  });

  return (
    <header className="flex gap-4 justify-between items-center p-2">
      <Link href="/">
        <H1>Inventory</H1>
      </Link>
      <div className="flex gap-4">
        {isAdmin ? (
          <Suspense>
            <AdminMenu />
          </Suspense>
        ) : null}
        {isSignedIn ? (
          <Link href="/api/auth/signout">
            <Button variant="ghost">
              <Icon name="logout" /> Sign Out
            </Button>
          </Link>
        ) : (
          <Link href="/api/auth/signin">
            <Button variant="ghost">
              <Icon name="login" /> Sign In
            </Button>
          </Link>
        )}
        {canCreateObject ? (
          <Suspense>
            <CreateObjectButton />
          </Suspense>
        ) : null}
      </div>
    </header>
  );
}
