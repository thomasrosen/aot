import { auth } from "@/auth";
import { H2 } from "@/components/Typography";
import { userHasOneOfPermissions } from "@/lib/permissions";
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

  const roles = await prisma.role.findMany();

  return (
    <>
      <H2>Roles</H2>
      <pre>{JSON.stringify(roles, null, 2)}</pre>
    </>
  );
}