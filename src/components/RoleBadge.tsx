import { roleIcons } from "@/constants";
import { Icon } from "./Icon";
import { Badge } from "./ui/badge";

export function RoleBadge({ roleName }: { roleName?: string }) {
  if (!roleName) {
    return null;
  }

  const roleIcon =
    roleName && roleIcons[roleName] ? roleIcons[roleName] : roleIcons.unknown;

  return (
    <Badge className="gap-1">
      <Icon name={roleIcon} size="sm" />
      {roleName}
    </Badge>
  );
}
