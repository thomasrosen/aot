import { prisma } from "@/prisma";

export async function loadLocations() {
  const rows = await prisma.location.findMany({
    select: {
      id: true,
      latitude: true,
      longitude: true,
      address: true,
      createdAt: true,
      updatedAt: true,
      // History: {
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
