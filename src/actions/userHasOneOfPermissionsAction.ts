"use server";

// these wrapper function exist to check permissions on the client.
// we can't trust the client to provide the correct userId, so we need to check the sessino on the server.

import { auth } from "@/auth";
import { userHasOneOfPermissions } from "@/lib/permissions";

export async function userHasOneOfPermissionsAction({
  permissionNames,
}: {
  permissionNames: string[];
  // resourceType?: string,
  // resourceId?: number
}): Promise<boolean> {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return false;
    }

    return await userHasOneOfPermissions({
      userId,
      permissionNames,
    });
  } catch (error) {
    console.error("ERROR_xdnZjteP", error);
  }

  return false;
}
