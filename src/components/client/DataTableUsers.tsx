"use client";

import { DataTable } from "@/components/client/DataTable";
import { DataTableSortingHeader } from "@/components/client/DataTableSortingHeader";
import { useLocale, useTranslations } from "@/components/client/Translation";
import UpdateUserButton from "@/components/client/UpdateUserButton";
import { formatDate } from "@/lib/formatDate";
import { useRelations } from "@/lib/relations";
import { UserFull } from "@/prisma_types";
import { ColumnDef } from "@tanstack/react-table";
import { RoleBadge } from "../RoleBadge";

export function DataTableUsers() {
  const locale = useLocale();
  const t = useTranslations();

  const users = useRelations<UserFull>({
    query: {
      tableName: "users",
      include: {
        userRolePairings: true,
      },
    },
  });

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
          <span className="font-mono">
            {formatDate(original?.updatedAt, locale)}
          </span>
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
        return (original?.userRolePairings || []).map((userRolePairing) => {
          return (
            <RoleBadge
              key={userRolePairing.roleName}
              roleName={userRolePairing.roleName}
            />
          );
        });
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

  return <DataTable columns={columns} data={users} />;
}
