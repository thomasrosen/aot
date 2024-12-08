"use server";

import { auth } from "@/auth";
import { userHasOneOfPermissions } from "@/lib/permissions";
import { prisma } from "@/prisma";
import { revalidatePath } from "next/cache";

export async function renameObject({
  code,
  name,
}: {
  code: string;
  name: string;
}): Promise<true> {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const isAllowed = await userHasOneOfPermissions({
      userId,
      permissionNames: ["renamed_objects"],
    });
    if (!isAllowed) {
      throw new Error("Not allowed");
    }

    const result = await prisma.object.update({
      where: {
        code,
      },
      data: {
        name,
      },
    });

    if (result) {
      revalidatePath(`/view/${code}`); // clear the page cache
      return true;
    }
  } catch (error) {
    console.error("ERROR_SpnCPuN6", error);
  }

  throw new Error("Failed to rename object");
}
