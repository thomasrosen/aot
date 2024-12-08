import { auth } from "@/auth";
import { PublicStartPage } from "@/components/client/PublicStartPage";
import { SignedInStartPage } from "@/components/server/SignedInStartPage";
import { userHasOneOfPermissions } from "@/lib/permissions";

export default async function StartPage() {
  const session = await auth();
  const isAllowed = await userHasOneOfPermissions({
    userId: session?.user?.id,
    permissionNames: ["search_objects"],
  });
  if (!isAllowed) {
    return <PublicStartPage />;
  }

  // all checks passed. User is signed in and has the required permissions.
  return <SignedInStartPage />;
}
