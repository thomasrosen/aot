import { Icon } from "@/components/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function SearchInput({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Input type="search" placeholder="Search... (klappt noch nicht)" />
      <Button size="icon" className="shrink-0">
        <Icon name="search" />
      </Button>
    </div>
  );
}
