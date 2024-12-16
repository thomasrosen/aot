import { auth } from "@/auth";
import { SubHeader } from "@/components/SubHeader";
import { loadTranslations } from "@/lib/server/fluent-server";
import { userHasOneOfPermissions } from "@/lib/server/permissions";
import { prisma } from "@/prisma";
import { Locale } from "@@/i18n-config";

export default async function PermissionsPage({
  params,
}: {
  params: { locale: Locale };
}) {
  const session = await auth();
  const isAllowed = await userHasOneOfPermissions({
    userId: session?.user?.id,
    permissionNames: ["admin"],
  });
  if (!isAllowed) {
    throw new Error("Not allowed");
  }

  const { locale } = await params;
  const t = loadTranslations(locale);

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
      <SubHeader title={t("permissions")} />
      <pre>{JSON.stringify(permissions, null, 2)}</pre>
    </>
  );
}
