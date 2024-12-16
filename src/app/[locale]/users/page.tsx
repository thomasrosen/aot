import { auth } from "@/auth";
import { SubHeader } from "@/components/SubHeader";
import { DataTableUsers } from "@/components/client/DataTableUsers";
import { loadTranslations } from "@/lib/server/fluent-server";
import { userHasOneOfPermissions } from "@/lib/server/permissions";
import { prisma } from "@/prisma";
import { Locale } from "@@/i18n-config";

export default async function UsersPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = loadTranslations(locale);

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
      <SubHeader title={t("users")} />
      <DataTableUsers data={users} />
    </>
  );
}
