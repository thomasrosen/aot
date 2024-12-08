import { auth } from "@/auth";
import { userHasOneOfPermissions } from "@/lib/permissions";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function listObjects() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    throw new Error("Not authenticated");
  }
  console.log("session", session);

  const isAllowed = await userHasOneOfPermissions({
    userId,
    permissionNames: ["view_objects"],
  });

  if (!isAllowed) {
    // throw new Error("Not allowed");
    return [];
  }

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
