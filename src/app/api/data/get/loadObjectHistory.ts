import { prisma } from "@/prisma";

export async function loadObjectHistory() {
  const rows = await prisma.objectHistory.findMany({
    select: {
      id: true,
      objectCode: true,
      locationId: true,
      email: true,
      verifiedHistoryEntry: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  if (Array.isArray(rows)) {
    return rows;
  }
  return [];
}
