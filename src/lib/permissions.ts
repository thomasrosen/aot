import { prisma } from "@/prisma";

export async function userHasOneOfPermissions({
  userId,
  permissionNames,
}: {
  userId?: string;
  permissionNames: string[];
  // resourceType?: string,
  // resourceId?: number
}): Promise<boolean> {
  try {
    if (!userId) {
      return false;
    }

    // always allow if user has admin role
    permissionNames.push("admin");

    // Check global roles first
    const globalCount = await prisma.user.count({
      where: {
        id: userId,
        roles: {
          some: {
            role: {
              permissions: {
                some: {
                  name: { in: permissionNames },
                },
              },
            },
          },
        },
      },
    });

    if (globalCount > 0) {
      return true;
    }

    // // Check resource-specific roles
    // if (resourceType && resourceId !== undefined) {
    //   const resourceCount = await prisma.resourceRoleAssignment.count({
    //     where: {
    //       userId,
    //       resourceType,
    //       resourceId,
    //       role: {
    //         permissions: {
    //           some: {
    //             name: { in: permissionNames },
    //           },
    //         },
    //       },
    //     },
    //   });
    //   if (resourceCount > 0) return true;
    // }
  } catch (error) {
    console.error("ERROR_QQQfrqRC", error);
  }

  return false;
}
