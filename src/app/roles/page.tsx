import { auth } from "@/auth";
import { H2 } from "@/components/Typography";
import { DataTableRoles } from "@/components/client/DataTableRoles";
import { userHasOneOfPermissions } from "@/lib/server/permissions";
import { prisma } from "@/prisma";

export default async function RolesPage() {
  const session = await auth();
  const isAllowed = await userHasOneOfPermissions({
    userId: session?.user?.id,
    permissionNames: ["admin"],
  });
  if (!isAllowed) {
    throw new Error("Not allowed");
  }

  let roles = await prisma.role.findMany({
    select: {
      name: true,
      updatedAt: true,
      permissions: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  roles = roles.map((role) => ({
    ...role,
    id: role.name,
  }));

  return (
    <>
      <H2>Roles</H2>
      <DataTableRoles data={roles} />
    </>
  );
}
