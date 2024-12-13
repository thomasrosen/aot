import { auth } from "@/auth";
import { SubHeader } from "@/components/SubHeader";
import { userHasOneOfPermissions } from "@/lib/server/permissions";
import { prisma } from "@/prisma";

export default async function PermissionsPage() {
  const session = await auth();
  const isAllowed = await userHasOneOfPermissions({
    userId: session?.user?.id,
    permissionNames: ["admin"],
  });
  if (!isAllowed) {
    throw new Error("Not allowed");
  }

  const permissions = await prisma.permission.findMany({
    select: {
      name: true,
      updatedAt: true,
      roles: {
        select: {
          name: true,
          userRolePairings: {
            select: {
              user: {
                select: {
                  email: true,
                },
              },
            },
          },
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  return (
    <>
      <SubHeader title="Permissions" breadcrumb="Permissions" />
      <pre>{JSON.stringify(permissions, null, 2)}</pre>
    </>
  );
}
