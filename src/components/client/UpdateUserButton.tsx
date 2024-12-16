"use client";

import { Button } from "@/components/ui/button";
import { UserFull } from "@/types";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { useTranslations } from "./Translation";

function UpdateUserButton({ user }: { user: UserFull }) {
  const t = useTranslations();
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
      toast.success(t("success-roles-updated"));
    } else {
      toast.error(t("error-roles-update-failes"));
    }
  }, [id, isAdmin, router]);

  return (
    <Button size="sm" onClick={setAdminRights}>
      {isAdmin ? t("remove-admin-rights") : t("give-admin-rights")}
    </Button>
  );
}

export default UpdateUserButton;
