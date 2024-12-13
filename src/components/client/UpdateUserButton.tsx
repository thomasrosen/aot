"use client";

import { Button } from "@/components/ui/button";
import { UserFull } from "@/types";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { toast } from "sonner";

function UpdateUserButton({ user }: { user: UserFull }) {
  const router = useRouter();
  const { id, userRolePairings } = user;
  const [isAdmin, setAdmin] = useState(
    (userRolePairings || []).some(
      (userRolePairing: any) => userRolePairing.roleName === "admin"
    )
  );

  const setAdminRights = useCallback(async () => {
    const response = await fetch("/api/roles/update", {
      method: "POST",
      body: JSON.stringify({
        userId: id,
        roleName: "admin",
        action: isAdmin ? "take" : "give",
      }),
    });

    console.log(response);

    let success = false;
    if (response.status === 200) {
      // get body and checck if done === true
      const resData = await response.json();
      if (resData.done) {
        success = true;
      }
    }

    if (success) {
      setAdmin(!isAdmin);
      router.refresh();
      toast("Roles change successful.");
    } else {
      toast("Roles change failed.");
    }
  }, [id, isAdmin, router]);

  return (
    <Button size="sm" onClick={setAdminRights}>
      {isAdmin ? "Remove Admin Rights" : "Give Admin Rights"}
    </Button>
  );
}

export default UpdateUserButton;
