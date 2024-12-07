import { auth } from "@/auth";
import { AddObjectButton } from "@/components/client/AddObjectButton";
import { Icon } from "@/components/Icon";
import { H1 } from "@/components/Typography";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Suspense } from "react";

export async function Header() {
  const session = await auth();

  const isSignedIn = !!session;
  const isMember = !!session; // session?.user?.role === "member";

  return (
    <header className="flex gap-4 justify-between items-center p-2">
      <Link href="/">
        <H1>Inventory</H1>
      </Link>
      <div className="flex gap-4">
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
        {isMember ? (
          <Suspense>
            <AddObjectButton />
          </Suspense>
        ) : null}
      </div>
    </header>
  );
}
