import { prisma } from "@/prisma";

export async function loadRolePermissionPairing() {
  const rows = await prisma.rolePermissionPairing.findMany({
    select: {
      id: true,
      roleName: true,
      permissionName: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  if (Array.isArray(rows)) {
    return rows;
  }
  return [];
}
