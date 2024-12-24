"use client";

import { DataTable } from "@/components/client/DataTable";
import { DataTableSortingHeader } from "@/components/client/DataTableSortingHeader";
import { useGlobalStore } from "@/components/client/GlobalStoreProvider";
import { useTranslations } from "@/components/client/Translation";
import UpdateUserButton from "@/components/client/UpdateUserButton";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/formatDate";
import { UserFull } from "@/prisma_types";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";

export function DataTableUsers() {
  const t = useTranslations();

  const { users, withUserRolePairings, fetchMany } = useGlobalStore(
    (state) => ({
      users: state.users,
      withUserRolePairings: state.withUserRolePairings,
      fetchMany: state.fetchMany,
    })
  );

  const [mappedUsers, setMappedUsers] = useState<UserFull[]>([]);
  useEffect(() => {
    if (!users.length) {
      fetchMany({
        tables: ["user"],
      });
    } else {
      async function asyncWrapper() {
        setMappedUsers(await withUserRolePairings(users));
      }
      asyncWrapper();
    }
  }, [users, fetchMany, withUserRolePairings]);

  const columns: ColumnDef<UserFull>[] = [
    {
      accessorKey: "id",
      header: ({ column }) => {
        return (
          <DataTableSortingHeader column={column}>
            {t("id")}
          </DataTableSortingHeader>
        );
      },
    },
    {
      accessorKey: "email",
      header: ({ column }) => {
        return (
          <DataTableSortingHeader column={column}>
            {t("email")}
          </DataTableSortingHeader>
        );
      },
    },
    {
      accessorKey: "updatedAt",
      header: ({ column }) => {
        return (
          <DataTableSortingHeader column={column}>
            {t("last-updated-at")}
          </DataTableSortingHeader>
        );
      },
      cell: ({ row }) => {
        const original = row.original;
        return (
          <span className="font-mono">{formatDate(original?.updatedAt)}</span>
        );
      },
    },
    {
      accessorKey: "userRolePairings",
      header: ({ column }) => {
        return (
          <DataTableSortingHeader column={column}>
            {t("roles")}
          </DataTableSortingHeader>
        );
      },
      cell: ({ row }) => {
        const original = row.original;
        return (original?.userRolePairings || []).map((userRolePairing) => (
          <Badge key={userRolePairing.roleName}>
            {userRolePairing.roleName}
          </Badge>
        ));
      },
    },
    {
      accessorKey: "actions",
      header: () => {
        return <div className="sr-only">{t("actions")}</div>;
      },
      cell: ({ row }) => {
        const original = row.original;
        return <UpdateUserButton user={original} />;
      },
    },
  ];

  return <DataTable columns={columns} data={mappedUsers} />;
}
