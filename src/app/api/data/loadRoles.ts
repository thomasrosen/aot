import { prisma } from "@/prisma";

export async function loadRoles() {
  const rows = await prisma.role.findMany({
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
