import { auth } from "@/auth";
import { SearchInput } from "@/components/SearchInput";
import { AddToObjecthistoryFormForStartPage } from "@/components/client/AddToObjecthistoryFormForStartPage";
import { userHasOneOfPermissions } from "@/lib/permissions";

export default async function StartPage() {
  const session = await auth();
  const canSearchObjects = await userHasOneOfPermissions({
    userId: session?.user?.id,
    permissionNames: ["search_objects"],
  });

  return (
    <>
      {canSearchObjects ? <SearchInput className="mb-8" /> : null}
      <AddToObjecthistoryFormForStartPage />
    </>
  );
}
