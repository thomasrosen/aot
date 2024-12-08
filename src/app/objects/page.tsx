import { auth } from "@/auth";
import { H2 } from "@/components/Typography";
import { userHasOneOfPermissions } from "@/lib/permissions";
import { prisma } from "@/prisma";
import Link from "next/link";

export default async function ObjectsPage() {
  const session = await auth();
  const isAllowed = await userHasOneOfPermissions({
    userId: session?.user?.id,
    permissionNames: ["admin"],
  });
  if (!isAllowed) {
    throw new Error("Not allowed");
  }

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
      <H2>Objects</H2>
      {Array.isArray(objects)
        ? objects.map((object) => (
            <Link
              key={object.code}
              href={`/objects/${object.code}`}
              className="hover:underline mb-4 block"
            >
              <pre>{JSON.stringify(object, null, 2)}</pre>
            </Link>
          ))
        : null}
    </>
  );
}
