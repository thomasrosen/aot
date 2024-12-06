import { Icon } from "./Icon";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

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
