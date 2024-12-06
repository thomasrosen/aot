"use client";

import { addObject } from "@/actions/addObject";
import { Icon } from "@/components/Icon";
import { H1 } from "@/components/Typography";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { toast } from "sonner";

export function Header() {
  const router = useRouter();
  const { data: session, status, update } = useSession();

  const handleAddObj = useCallback(async () => {
    try {
      const code = await addObject();

      if (code) {
        toast("Object created");
        router.push(`/view/${code}`);
      } else {
        throw new Error("ERROR_bVN5t7qz Unkown error.");
      }
    } catch (error) {
      toast(`Failed to create object: ${error}`);
      console.error("ERROR_dpBQWmlU handleAddObj error", error);
    }
  }, [router]);

  return (
    <header className="flex gap-4 justify-between items-center p-2">
      <H1>Inventar</H1>
      <div className="flex gap-4">
        {status === "authenticated" ? (
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

        <Button onClick={handleAddObj}>
          <Icon name="add" /> Add
        </Button>
      </div>
    </header>
  );
}
