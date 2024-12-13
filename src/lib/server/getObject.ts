// import { auth } from "@/auth";
import { auth } from "@/auth";
import { prisma } from "@/prisma";
import type PrismaTypes from "@prisma/client";

export async function getObject({
  code,
}: {
  code: string;
}): Promise<Partial<PrismaTypes.Object> | null> {
  let select: PrismaTypes.Prisma.ObjectSelect = {
    code: true,
  };

  const session = await auth();
  if (session) {
    select = {
      ...select,
      name: true,
      updatedAt: true,
      history: {
        orderBy: { updatedAt: "desc" },
        select: {
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
              userRolePairings: {
                select: {
                  roleName: true,
                  role: {
                    select: {
                      permissions: {
                        select: {
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
          updatedAt: true,
        },
      },
    };
  }

  return await prisma.object.findFirst({
    where: { code },
    orderBy: { updatedAt: "desc" },
    select,
    // select: {
    //   code: true,
    //   name: true,
    // },
  });
}
