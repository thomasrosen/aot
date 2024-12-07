import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function listObjects() {
  const session = await auth();
  if (!session) {
    throw new Error("Not authenticated");
  }

  // todo also check for permissions

  const objects = await prisma.object.findMany();
  return objects;
}
