import { auth } from "@/auth";
import { H2 } from "@/components/Typography";
import { userHasOneOfPermissions } from "@/lib/permissions";
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

  const permissions = await prisma.permission.findMany();

  return (
    <>
      <H2>Permissions</H2>
      <pre>{JSON.stringify(permissions, null, 2)}</pre>
    </>
  );
}
