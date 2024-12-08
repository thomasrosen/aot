"use server";

import { auth } from "@/auth";
import { generateCode } from "@/lib/generateCode";
import { userHasOneOfPermissions } from "@/lib/permissions";
import { prisma } from "@/prisma";

export async function createObject(): Promise<string> {
  const session = await auth();
  const isAllowed = await userHasOneOfPermissions({
    userId: session?.user?.id,
    permissionNames: ["create_objects"],
  });
  if (!isAllowed) {
    throw new Error("Not allowed");
  }

  const code = await generateCode();

  // create new empty object with prisma
  const data = await prisma.object.create({
    data: { code },
  });

  if (!data) {
    throw new Error("ERROR_Qy0Mf3wB Failed to create object");
  }

  return code;
}
