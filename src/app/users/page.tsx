import { auth } from "@/auth";
import { H2 } from "@/components/Typography";
import { userHasOneOfPermissions } from "@/lib/permissions";
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

  const users = await prisma.user.findMany();

  return (
    <>
      <H2>Users</H2>
      <pre>{JSON.stringify(users, null, 2)}</pre>
    </>
  );
}
