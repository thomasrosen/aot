import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { object_code_prefix } from "@/constants";
import { formatDate } from "@/lib/formatDate";
import { userRolePairingsIncludesPermissions } from "@/lib/permissions";
import { ObjectFull } from "@/types";

export function ObjectCard({ data }: { data: ObjectFull }) {
  const firstObjectHistory = (data?.history || []).at(0);

  const isTrusted = userRolePairingsIncludesPermissions({
    userRolePairings: firstObjectHistory?.user?.userRolePairings,
    permissionNames: ["trusted", "admin"],
  });
  const isVerified = !!firstObjectHistory?.verifiedHistoryEntry;

  const location = firstObjectHistory?.location;

  const firstObjectHistoryUpdatedAt = firstObjectHistory?.updatedAt;
  const updatedAt = data.updatedAt;

  const newestUpdatedAt =
    (firstObjectHistoryUpdatedAt || 0) > (updatedAt || 0)
      ? firstObjectHistoryUpdatedAt
      : updatedAt;

  const hasName = data.name && data.name.length > 0;

  const codeBadge = (
    <Badge className="whitespace-nowrap">
      {object_code_prefix}
      {data.code}
    </Badge>
  );

  return (
    <Card className="transition-colors hover:bg-accent hover:text-accent-foreground">
      <CardHeader>
        <CardTitle>{hasName ? data.name : codeBadge}</CardTitle>
        <CardDescription>
          <div className="flex gap-2 items-center flex-wrap pt-1 pb-2">
            {hasName ? codeBadge : null}
            <Badge
              className="shrink-0"
              variant={isTrusted ? "secondary" : "destructive"}
            >
              {isTrusted ? "✅ Is from Trusted User" : "Not a Trusted User"}
            </Badge>
            <Badge
              className="shrink-0"
              variant={isVerified ? "secondary" : "destructive"}
            >
              {isVerified ? "✅ Verified" : "Not Verified"}
            </Badge>
          </div>
          <div>
            {location?.address
              ? location.address
              : `${location?.latitude} / ${location?.longitude}`}
          </div>
          <div>{formatDate(newestUpdatedAt)}</div>
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
