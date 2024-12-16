"use client";

import { createObject } from "@/actions/createObject";
import { Icon } from "@/components/Icon";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { toast } from "sonner";
import { useTranslations } from "./Translation";

export function CreateObjectButton() {
  const router = useRouter();
  const t = useTranslations();

  const handleCreateObject = useCallback(async () => {
    try {
      const code = await createObject();

      if (code) {
        toast("Object created");
        router.push(`/objects/${code}`);
      } else {
        throw new Error(t("error-unkown-error"));
      }
    } catch (error) {
      const isError = error instanceof Error;
      toast.error(t("error-failed-to-create-object"), {
        description: isError ? error.message : String(error),
      });
    }
  }, [router, t]);

  return (
    <Button onClick={handleCreateObject}>
      <Icon name="add" />
      {t("create-object")}
    </Button>
  );
}
