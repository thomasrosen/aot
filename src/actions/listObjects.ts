import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function listObjects() {
  const objects = await prisma.object.findMany();
  return {
    objects,
  };
}
