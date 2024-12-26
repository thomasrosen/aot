import { prisma } from "@/prisma";

export async function loadPermissions() {
  const rows = await prisma.permission.findMany({
    select: {
      id: true,
      name: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  if (Array.isArray(rows)) {
    return rows;
  }
  return [];
}
