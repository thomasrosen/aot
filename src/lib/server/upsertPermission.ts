import { prisma } from "@/prisma";

export async function upsertPermission({ name }: { name: string }) {
  return await prisma.permission.upsert({
    where: { name },
    update: { name },
    create: { name },
  });
}
