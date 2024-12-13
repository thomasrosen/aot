"use client";

import { Icon } from "@/components/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useState } from "react";

export function SearchInput({ className }: { className?: string }) {
  const [value, setValue] = useState("");

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        type="search"
        placeholder="Search... (klappt noch nicht)"
      />
      {value.length > 0 ? (
        <Button size="icon" className="shrink-0">
          <Icon name="search" />
        </Button>
      ) : null}
    </div>
  );
}
