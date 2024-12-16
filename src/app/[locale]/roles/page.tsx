import { auth } from "@/auth";
import { SubHeader } from "@/components/SubHeader";
import { DataTableRoles } from "@/components/client/DataTableRoles";
import { loadTranslations } from "@/lib/server/fluent-server";
import { userHasOneOfPermissions } from "@/lib/server/permissions";
import { prisma } from "@/prisma";
import { Locale } from "@@/i18n-config";

export default async function RolesPage({
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
      <SubHeader title={t("roles")} />
      <DataTableRoles data={roles} />
    </>
  );
}
