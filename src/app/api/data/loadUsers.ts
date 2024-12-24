import { prisma } from "@/prisma";

export async function loadUsers() {
  const rows = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      emailVerified: true,
      updatedAt: true,
      // userRolePairings: {
      //   select: {
      //     id: true,
      //   },
      // },
      // objectHistory: {
      //   select: {
      //     id: true,
      //   },
      // },
    },
  });
  if (Array.isArray(rows)) {
    return rows;
  }
  return [];
}
