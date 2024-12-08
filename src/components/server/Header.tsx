import { auth } from "@/auth";
import { AddObjectButton } from "@/components/client/AddObjectButton";
import { Icon } from "@/components/Icon";
import { H1 } from "@/components/Typography";
import { Button } from "@/components/ui/button";
import { userHasOneOfPermissions } from "@/lib/permissions";
import Link from "next/link";
import { Suspense } from "react";

export async function Header() {
  const session = await auth();
  const canCreateObject = await userHasOneOfPermissions({
    userId: session?.user?.id,
    permissionNames: ["create_object"],
  });

  return (
    <header className="flex gap-4 justify-between items-center p-2">
      <Link href="/">
        <H1>Inventory</H1>
      </Link>
      <div className="flex gap-4">
        {session ? (
          // sessions is null if the user is not signed in
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
            <AddObjectButton />
          </Suspense>
        ) : null}
      </div>
    </header>
  );
}
