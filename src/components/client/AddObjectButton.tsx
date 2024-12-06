"use client";

import { addObject } from "@/actions/addObject";
import { Icon } from "@/components/Icon";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { toast } from "sonner";

export function AddObjectButton() {
  const router = useRouter();

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
    <Button onClick={handleAddObj}>
      <Icon name="add" /> Add
    </Button>
  );
}
