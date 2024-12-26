import { prisma } from "@/prisma";

export async function loadObjects() {
  const rows = await prisma.object.findMany({
    select: {
      id: true,
      code: true,
      name: true,
      updatedAt: true,
      // history: {
      //   select: {
      //     id: true,
      //   },
      // },
      /*
      history: {
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
        select: {
          id: true,
          updatedAt: true,
          location: {
            select: {
              id: true,
              address: true,
              latitude: true,
              longitude: true,
            },
          },
          user: {
            select: {
              id: true,
              email: true,
              userRolePairings: {
                select: {
                  id: true,
                  role: {
                    select: {
                      id: true,
                      permissions: {
                        select: {
                          id: true,
                          name: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          verifiedHistoryEntry: true,
        },
      },
      */
    },
  });
  if (Array.isArray(rows)) {
    return rows;
  }
  return [];
}
