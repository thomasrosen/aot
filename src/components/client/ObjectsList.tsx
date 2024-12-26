"use client";

import { useRelations } from "@/lib/relations";
import { ObjectFull } from "@/prisma_types";
import Link from "next/link";
import { ObjectCard } from "../ObjectCard";
import { useLocale } from "./Translation";

export function ObjectsList() {
  const locale = useLocale();

  const objects = useRelations<ObjectFull>({
    query: {
      tableName: "objects",
      include: {
        history: {
          include: {
            location: true,
            user: {
              include: {
                userRolePairings: {
                  include: {
                    role: {
                      include: {
                        rolePermissionPairings: {
                          include: {
                            permission: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  return (
    <div className="flex flex-col gap-4">
      {objects.map((object) => (
        <Link key={object.id} href={`/objects/${object.code}`}>
          <ObjectCard data={object} locale={locale} />
        </Link>
      ))}
    </div>
  );
}
