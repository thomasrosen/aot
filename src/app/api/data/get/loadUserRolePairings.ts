import { PublicWhere } from "@/lib/relations";
import { prisma } from "@/prisma";

export async function loadUserRolePairings({ where }: { where?: PublicWhere }) {
  const realFullWhere: Record<string, any> = {};

  if (where && where.userRolePairings && where.userRolePairings.userId) {
    if (Array.isArray(where.userRolePairings.userId)) {
      realFullWhere.userId = {
        in: where.userRolePairings.userId,
      };
    } else {
      realFullWhere.userId = where.userRolePairings.userId;
    }
  }

  const rows = await prisma.userRolePairing.findMany({
    where: realFullWhere,
    select: {
      id: true,
      userId: true,
      roleName: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  if (Array.isArray(rows)) {
    return rows;
  }
  return [];
}
