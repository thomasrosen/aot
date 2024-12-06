// import { auth } from "@/auth";
import { auth } from "@/auth";
import { prisma } from "@/prisma";
import type PrismaTypes from "@prisma/client";

export async function getObject({
  code,
}: {
  code: string;
}): Promise<Partial<PrismaTypes.Object> | null> {
  let include = {};

  const session = await auth();
  if (session) {
    include = {
      objectHistory: {
        orderBy: { updatedAt: "desc" },
        select: {
          id: true,

          locationId: true,
          location: true,

          note: true,

          email: true,
          verified: true,

          createdAt: true,
          updatedAt: true,
        },
      },
    };
  }

  return await prisma.object.findFirst({
    where: { code },
    orderBy: { updatedAt: "desc" },
    select: {
      code: true,
      name: true,
    },
  });
}
