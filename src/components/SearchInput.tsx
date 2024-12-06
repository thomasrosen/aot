import { Icon } from "@/components/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function SearchInput() {
  return (
    <div className="flex items-center gap-2">
      <Input type="search" placeholder="Search..." />
      <Button size="icon">
        <Icon name="search" size="md" />
      </Button>
    </div>
  );
}
