"use server";

import { auth } from "@/auth";
import { generateCode } from "@/lib/generateCode";
import { userHasOneOfPermissions } from "@/lib/permissions";
import { prisma } from "@/prisma";

export async function addObject(): Promise<string> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    throw new Error("Not authenticated");
  }

  const isAllowed = await userHasOneOfPermissions({
    userId,
    permissionNames: ["create_objects"],
  });

  if (!isAllowed) {
    throw new Error("Not allowed");
  }

  // todo also check for permissions

  const code = await generateCode();
  console.log("addObject-code", code);

  // create new empty object with prisma
  const data = await prisma.object.create({
    data: { code },
  });

  console.log("addObject-data", data);

  if (!data) {
    throw new Error("ERROR_Qy0Mf3wB Failed to create object");
  }

  return code;
}
