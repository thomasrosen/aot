import { prisma } from "@/prisma";

export async function upsertRole({
  name,
  permissions = [],
}: {
  name: string;
  permissions?: string[];
}) {
  const commonSetQuery: Record<string, any> = {};
  if (permissions.length > 0) {
    commonSetQuery.permissions = {
      connectOrCreate: permissions.map((permissionName) => ({
        where: {
          name: permissionName,
        },
        create: {
          name: permissionName,
        },
      })),
    };
  }

  return await prisma.role.upsert({
    where: { name },
    update: { name, ...commonSetQuery },
    create: { name, ...commonSetQuery },
  });
}
