import { auth } from "@/auth";
import { ObjectCard } from "@/components/ObjectCard";
import { SubHeader } from "@/components/SubHeader";
import { CreateObjectButton } from "@/components/client/CreateObjectButton";
import { loadTranslations } from "@/lib/server/fluent-server";
import { userHasOneOfPermissions } from "@/lib/server/permissions";
import { prisma } from "@/prisma";
import { Locale } from "@@/i18n-config";
import Link from "next/link";

export default async function ObjectsPage({
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

  const canCreateObject = await userHasOneOfPermissions({
    userId: session?.user?.id,
    permissionNames: ["create_objects"],
  });

  const objects = await prisma.object.findMany({
    select: {
      code: true,
      name: true,
      updatedAt: true,
      history: {
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
        select: {
          updatedAt: true,
          location: {
            select: {
              address: true,
              latitude: true,
              longitude: true,
            },
          },
          user: {
            select: {
              email: true,
              userRolePairings: {
                select: {
                  role: {
                    select: {
                      permissions: {
                        select: {
                          name: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          verifiedHistoryEntry: true,
        },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  return (
    <>
      <SubHeader
        title={t("objects")}
        actions={<>{canCreateObject ? <CreateObjectButton /> : null}</>}
      />

      <div className="flex flex-col gap-4">
        {Array.isArray(objects)
          ? objects.map((object) => (
              <Link key={object.code} href={`/objects/${object.code}`}>
                <ObjectCard data={object} locale={locale} />
              </Link>
            ))
          : null}
      </div>
    </>
  );
}
