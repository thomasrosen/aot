import { auth } from "@/auth";
import { SubHeader } from "@/components/SubHeader";
import { DataTableUsers } from "@/components/client/DataTableUsers";
import { userHasOneOfPermissions } from "@/lib/server/permissions";
import { prisma } from "@/prisma";

export default async function UsersPage() {
  const session = await auth();
  const isAllowed = await userHasOneOfPermissions({
    userId: session?.user?.id,
    permissionNames: ["admin"],
  });
  if (!isAllowed) {
    throw new Error("Not allowed");
  }

  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      emailVerified: true,
      updatedAt: true,
      userRolePairings: {
        select: {
          roleName: true,
        },
      },
    },
    orderBy: {
      email: "asc",
    },
  });

  return (
    <>
      <SubHeader title="Users" breadcrumb="Users" />
      <DataTableUsers data={users} />
    </>
  );
}
