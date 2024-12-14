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

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Icon } from "./Icon";

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
          <div className="flex gap-2 py-1 flex-wrap">
            {isTrusted ? (
              <Badge className="shrink-0" variant="secondary">
                ✅ Is from Trusted User
              </Badge>
            ) : (
              <AlertDialog>
                <AlertDialogTrigger>
                  <Badge className="shrink-0" variant="destructive">
                    Not a Trusted User
                  </Badge>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Trust this Person?</AlertDialogTitle>
                    <AlertDialogDescription className="flex flex-col space-y-2">
                      <strong>
                        This entry is from someone not yet marked as trusted.
                      </strong>
                      <span>
                        If you recognize this person by their email address, you
                        can mark them as trusted. This decision will ensure
                        their future entries are automatically verified. If
                        needed, an admin can undo this action.
                      </span>
                      <span>
                        The location entry is signed with the email address:{" "}
                        <strong className="font-mono">
                          {data.user?.email}
                        </strong>
                      </span>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>
                      <Icon name="cancel" />
                      No, Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction>
                      <Icon name="check" />
                      Yes, I Trust this Person
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}

            <AlertDialog>
              <AlertDialogTrigger>
                <Badge
                  className="shrink-0"
                  variant={isVerified ? "secondary" : "destructive"}
                >
                  {isVerified ? "✅ Verified" : "Not Verified"}
                </Badge>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    {isVerified ? "✅ Email Verified" : "⚠️ Email Not Verified"}
                  </AlertDialogTitle>
                  {isVerified ? (
                    <AlertDialogDescription className="flex flex-col space-y-2">
                      <span>
                        The email address{" "}
                        <strong className="font-mono">
                          {data.user?.email}
                        </strong>{" "}
                        has been verified and confirmed for this location
                        submission.
                      </span>
                      <span>
                        Verification was completed by either:
                        <br />
                        Clicking a link in a confirmation email or being signed
                        in with their account.
                      </span>
                    </AlertDialogDescription>
                  ) : (
                    <AlertDialogDescription className="flex flex-col space-y-2">
                      <span>
                        The email address{" "}
                        <strong className="font-mono">
                          {data.user?.email}
                        </strong>{" "}
                        has <strong>not</strong> been verified.
                      </span>
                      <span>
                        This means the person has not confirmed their submission
                        by:
                        <br />
                        Clicking the verification link sent to their email, or
                        <br />
                        Signing in with their account.
                        <br />
                      </span>
                      <span>
                        Without verification, this submission cannot be fully
                        trusted.
                      </span>
                    </AlertDialogDescription>
                  )}
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogAction>Okay</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          <div>{data.user?.email}</div>

          <div>{formatDate(data.updatedAt)}</div>
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
