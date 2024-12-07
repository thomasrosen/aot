import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function listObjects() {
  const session = await auth();
  if (!session) {
    throw new Error("Not authenticated");
  }

  // todo also check for permissions

  const objects = await prisma.object.findMany({
    orderBy: {
      updatedAt: "desc",
    },
    select: {
      code: true,
      name: true,
      updatedAt: true,
      history: {
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
        select: {
          updatedAt: true,
          location: {
            select: {
              address: true,
              latitude: true,
              longitude: true,
            },
          },
          user: {
            select: {
              email: true,
            },
          },
          verifiedHistoryEntry: true,
        },
      },
    },
  });
  return objects;
}
