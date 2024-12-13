import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDate } from "@/lib/formatDate";
import { userRolePairingsIncludesPermissions } from "@/lib/permissions";
import { ObjectHistoryFull } from "@/types";

export function ObjectHistoryCard({ data }: { data: ObjectHistoryFull }) {
  const isTrusted = userRolePairingsIncludesPermissions({
    userRolePairings: data.user?.userRolePairings,
    permissionNames: ["trusted", "admin"],
  });
  const isVerified = !!data.verifiedHistoryEntry;
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {data.location?.address
            ? data.location.address
            : `${data.location?.latitude} / ${data.location?.longitude}`}
        </CardTitle>
        <CardDescription>
          <div className="flex gap-2 py-1">
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

          <div>{data.user?.email}</div>

          <div>{formatDate(data.updatedAt)}</div>
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
