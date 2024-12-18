import { VerificationBadges } from "@/components/server/VerificationBadges";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDate } from "@/lib/formatDate";
import { userRolePairingsIncludesPermissions } from "@/lib/permissions";
import { ObjectFull } from "@/prisma_types";
import { Locale } from "@@/i18n-config";

export function ObjectCard({
  data,
  locale,
}: {
  data: ObjectFull;
  locale: Locale;
}) {
  const firstObjectHistory = (data?.history || []).at(0);

  const isTrusted = userRolePairingsIncludesPermissions({
    userRolePairings: firstObjectHistory?.user?.userRolePairings,
    permissionNames: ["trusted"],
  });
  const isVerified = !!firstObjectHistory?.verifiedHistoryEntry;

  const location = firstObjectHistory?.location;

  const firstObjectHistoryUpdatedAt = firstObjectHistory?.updatedAt;
  const updatedAt = data.updatedAt;

  const newestUpdatedAt =
    (firstObjectHistoryUpdatedAt || 0) > (updatedAt || 0)
      ? firstObjectHistoryUpdatedAt
      : updatedAt;

  return (
    <Card className="transition-colors hover:bg-accent hover:text-accent-foreground">
      <CardHeader>
        {data.name ? <CardTitle>{data.name}</CardTitle> : null}
        <CardDescription>
          <VerificationBadges
            isTrusted={isTrusted}
            isVerified={isVerified}
            email={firstObjectHistory?.user?.email || ""}
            className="pointer-events-none"
            locale={locale}
          />
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
