"use server";

import { auth } from "@/auth";
import { userHasOneOfPermissions } from "@/lib/server/permissions";
import { prisma } from "@/prisma";

export async function verifyObjectHistory({
  id,
}: {
  id: string;
}): Promise<boolean> {
  const session = await auth();
  const userId = session?.user?.id;
  const isAllowed = await userHasOneOfPermissions({
    userId,
    permissionNames: ["create_objects"],
  });
  if (!isAllowed) {
    throw new Error("Not allowed");
  }

  if (!id) {
    throw new Error("Missing id");
  }

  // check if object history exists
  const objectHistory = await prisma.objectHistory.findUnique({
    where: {
      id,
      user: { id: userId }, // make sure the submission was from the user
    },
  });

  if (!objectHistory) {
    throw new Error("ERROR_q9yf91lK Object history not found.");
  }

  // set object history as verified
  const data = await prisma.objectHistory.update({
    where: {
      id,
      user: { id: userId }, // make sure the submission was from the user
    },
    data: {
      verifiedHistoryEntry: new Date(),
    },
  });

  console.log("verifyObjectHistory-data", data);

  if (!data) {
    throw new Error("ERROR_4lZc2h2y Failed to update object history.");
  }

  return true;
}
