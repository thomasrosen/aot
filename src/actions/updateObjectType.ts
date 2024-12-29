"use server";

import { auth } from "@/auth";
import { userHasOneOfPermissions } from "@/lib/server/permissions";
import { prisma } from "@/prisma";
import { revalidatePath } from "next/cache";

export async function updateObjectType({
  code,
  type,
}: {
  code: string;
  type: string;
}): Promise<true> {
  try {
    const session = await auth();
    const isAllowed = await userHasOneOfPermissions({
      userId: session?.user?.id,
      permissionNames: ["edit_objects"],
    });
    if (!isAllowed) {
      throw new Error("Not allowed");
    }

    const result = await prisma.object.update({
      where: {
        code,
      },
      data: {
        type,
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
