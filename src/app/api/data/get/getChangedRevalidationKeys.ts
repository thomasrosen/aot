import { hashRevalidationKey } from "@/lib/hashRevalidationKey";
import { prisma } from "@/prisma";

export async function getChangedRevalidationKeys({
  lastRevalidatedAt,
}: {
  lastRevalidatedAt: string | null;
}) {
  try {
    const revalidationKeys = new Set<string>();

    if (!lastRevalidatedAt) {
      throw new Error("lastRevalidatedAt is required");
    }

    const lastRevalidatedAtAsDate = new Date(lastRevalidatedAt);
    if (isNaN(lastRevalidatedAtAsDate.getTime())) {
      throw new Error("lastRevalidatedAt is invalid");
    }

    try {
      const tableName = "object";
      const rows = await prisma.object.findMany({
        select: {
          id: true,
        },
        where: {
          updatedAt: {
            gt: lastRevalidatedAtAsDate,
          },
        },
        take: 10,
      });
      if (rows) {
        for (const row of rows) {
          revalidationKeys.add(`${tableName}:${row.id}`);
        }
      }
    } catch (error) {
      // ignoring the error
    }

    try {
      const tableName = "location";
      const rows = await prisma.location.findMany({
        select: {
          id: true,
        },
        where: {
          updatedAt: {
            gt: lastRevalidatedAtAsDate,
          },
        },
        take: 10,
      });
      if (rows) {
        for (const row of rows) {
          revalidationKeys.add(`${tableName}:${row.id}`);
        }
      }
    } catch (error) {
      // ignoring the error
    }

    try {
      const tableName = "user";
      const rows = await prisma.user.findMany({
        select: {
          id: true,
        },
        where: {
          updatedAt: {
            gt: lastRevalidatedAtAsDate,
          },
        },
        take: 10,
      });
      if (rows) {
        for (const row of rows) {
          revalidationKeys.add(`${tableName}:${row.id}`);
        }
      }
    } catch (error) {
      // ignoring the error
    }

    try {
      const tableName = "role";
      const rows = await prisma.role.findMany({
        select: {
          id: true,
        },
        where: {
          updatedAt: {
            gt: lastRevalidatedAtAsDate,
          },
        },
        take: 10,
      });
      if (rows) {
        for (const row of rows) {
          revalidationKeys.add(`${tableName}:${row.id}`);
        }
      }
    } catch (error) {
      // ignoring the error
    }

    try {
      const tableName = "permission";
      const rows = await prisma.permission.findMany({
        select: {
          id: true,
        },
        where: {
          updatedAt: {
            gt: lastRevalidatedAtAsDate,
          },
        },
        take: 10,
      });
      if (rows) {
        for (const row of rows) {
          revalidationKeys.add(`${tableName}:${row.id}`);
        }
      }
    } catch (error) {
      // ignoring the error
    }

    try {
      const tableName = "objectHistory";
      const rows = await prisma.objectHistory.findMany({
        select: {
          id: true,
        },
        where: {
          updatedAt: {
            gt: lastRevalidatedAtAsDate,
          },
        },
        take: 10,
      });
      if (rows) {
        for (const row of rows) {
          revalidationKeys.add(`${tableName}:${row.id}`);
        }
      }
    } catch (error) {
      // ignoring the error
    }

    try {
      const tableName = "globalSetting";
      const rows = await prisma.globalSetting.findMany({
        select: {
          id: true,
        },
        where: {
          updatedAt: {
            gt: lastRevalidatedAtAsDate,
          },
        },
        take: 10,
      });
      if (rows) {
        for (const row of rows) {
          revalidationKeys.add(`${tableName}:${row.id}`);
        }
      }
    } catch (error) {
      // ignoring the error
    }

    try {
      const tableName = "userRolePairing";
      const rows = await prisma.userRolePairing.findMany({
        select: {
          id: true,
        },
        where: {
          updatedAt: {
            gt: lastRevalidatedAtAsDate,
          },
        },
        take: 10,
      });
      if (rows) {
        for (const row of rows) {
          revalidationKeys.add(`${tableName}:${row.id}`);
        }
      }
    } catch (error) {
      // ignoring the error
    }

    return [...revalidationKeys].map((key) => hashRevalidationKey(key));
  } catch (error) {
    // ignoring the error
    if (error instanceof Error) {
      console.error("getChangedRevalidationKeys", error.message);
    } else {
      console.error("getChangedRevalidationKeys", String(error));
    }
  }

  return [];
}
