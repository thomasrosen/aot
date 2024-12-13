"use client";

import { createObject } from "@/actions/createObject";
import { Icon } from "@/components/Icon";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { toast } from "sonner";

export function CreateObjectButton() {
  const router = useRouter();

  const handleCreateObject = useCallback(async () => {
    try {
      const code = await createObject();

      if (code) {
        toast("Object created");
        router.push(`/objects/${code}`);
      } else {
        throw new Error("ERROR_bVN5t7qz Unkown error.");
      }
    } catch (error) {
      toast(`Failed to create object: ${error}`);
      console.error("ERROR_dpBQWmlU handleCreateObject error", error);
    }
  }, [router]);

  return (
    <Button onClick={handleCreateObject}>
      <Icon name="add" />
      Add
    </Button>
  );
}
