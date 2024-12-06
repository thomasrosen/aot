"use client";

import { addObject } from "@/actions/addObject";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { toast } from "sonner";
import { Icon } from "./Icon";
import { H1 } from "./Typography";

export function Header() {
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
  }, []);

  return (
    <header className="flex gap-4 justify-between items-center p-2">
      <H1>Inventar</H1>
      <Button onClick={handleAddObj}>
        <Icon name="add" /> Add
      </Button>
    </header>
  );
}
