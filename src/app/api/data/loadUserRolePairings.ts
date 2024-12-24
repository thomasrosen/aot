import { prisma } from "@/prisma";
import { Filters } from "./route";

export async function loadUserRolePairings({ filters }: { filters?: Filters }) {
  let where = undefined;

  if (filters && filters.userIds) {
    where = {
      userId: {
        in: filters.userIds,
      },
    };
  }

  const rows = await prisma.userRolePairing.findMany({
    where,
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
