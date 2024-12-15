import { VerificationBadges } from "@/components/VerificationBadges";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDate } from "@/lib/formatDate";
import { userRolePairingsIncludesPermissions } from "@/lib/permissions";
import { ObjectHistoryFull } from "@/types";

export function ObjectHistoryCard({
  data,
  className,
}: {
  data: ObjectHistoryFull;
  className?: string;
}) {
  const isTrusted = userRolePairingsIncludesPermissions({
    userRolePairings: data.user?.userRolePairings,
    permissionNames: ["trusted"],
  });
  const isVerified = !!data.verifiedHistoryEntry;
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>
          {data.location?.address
            ? data.location.address
            : `${data.location?.latitude} / ${data.location?.longitude}`}
        </CardTitle>
        <CardDescription>
          <VerificationBadges
            isTrusted={isTrusted}
            isVerified={isVerified}
            email={data.user?.email || ""}
          />
          <div className="font-mono">
            {formatDate(data.updatedAt)} • {data.user?.email}
          </div>
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
