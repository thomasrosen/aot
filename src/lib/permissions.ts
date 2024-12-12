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
        userRolePairings: {
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

export async function userHasRole({
  userId,
  roleName,
}: {
  userId: string;
  roleName: string;
}): Promise<boolean> {
  try {
    const existingUserRole = await prisma.userRolePairing.findFirst({
      where: {
        userId,
        roleName,
        objectCode: null,
        locationId: null,
      },
    });

    if (existingUserRole) {
      return true;
    }
  } catch (error) {
    // gobble up error. probably no need to show it
  }

  return false;
}

export async function giveUserRole({
  userId,
  roleName,
}: {
  userId: string;
  roleName: string;
}): Promise<boolean> {
  try {
    await prisma.userRolePairing.upsert({
      where: {
        userId_roleName: {
          userId,
          roleName,
        },
      },
      update: {},
      create: {
        user: {
          connect: {
            id: userId,
          },
        },
        role: {
          connect: {
            name: roleName,
          },
          // connectOrCreate: {
          //   where: {
          //     name: roleName,
          //   },
          //   create: {
          //     name: roleName,
          //   },
          // },
        },
      },
    });

    return true;
  } catch (error) {
    // gobble up error. probably no need to show it
  }

  return false;
}

export async function takeUserRole({
  userId,
  roleName,
}: {
  userId: string;
  roleName: string;
}): Promise<boolean> {
  try {
    await prisma.userRolePairing.deleteMany({
      where: {
        userId,
        roleName,
        objectCode: null,
        locationId: null,
      },
    });

    return true;
  } catch (error) {
    // gobble up error. probably no need to show it
  }

  return false;
}

export async function toggleUserRole({
  userId,
  roleName,
}: {
  userId: string;
  roleName: string;
}) {
  try {
    if (
      await userHasRole({
        userId,
        roleName,
      })
    ) {
      await giveUserRole({
        userId,
        roleName,
      });
    } else {
      await takeUserRole({
        userId,
        roleName,
      });
    }

    return true;
  } catch (error) {
    // gobble up error. probably no need to show it
  }

  return false;
}
