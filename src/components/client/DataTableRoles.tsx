"use client";

import { DataTable } from "@/components/client/DataTable";
import { DataTableSortingHeader } from "@/components/client/DataTableSortingHeader";
import { useTranslations } from "@/components/client/Translation";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/formatDate";
import { RoleFull } from "@/prisma_types";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { useGlobalStore } from "./GlobalStoreProvider";

export function DataTableRoles() {
  const t = useTranslations();

  const { roles, withPermissions, fetchMany } = useGlobalStore((state) => ({
    roles: state.roles,
    withPermissions: state.withPermissions,
    fetchMany: state.fetchMany,
  }));

  const [mappedRoles, setMappedRoles] = useState<RoleFull[]>([]);
  useEffect(() => {
    if (!roles.length) {
      fetchMany({
        tables: ["role"],
      });
    } else {
      async function asyncWrapper() {
        setMappedRoles(await withPermissions(roles));
      }
      asyncWrapper();
    }
  }, [roles, fetchMany, withPermissions]);

  const columns: ColumnDef<RoleFull>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <DataTableSortingHeader column={column}>
            {t("name")}
          </DataTableSortingHeader>
        );
      },
      cell: ({ row }) => {
        const original = row.original;
        return <span className="font-mono">{original.name}</span>;
      },
    },
    {
      accessorKey: "permissions",
      header: ({ column }) => {
        return (
          <DataTableSortingHeader column={column}>
            {t("permissions")}
          </DataTableSortingHeader>
        );
      },
      cell: ({ row }) => {
        const original = row.original;
        return (original?.permissions || []).map((permissions) => (
          <Badge key={permissions.name}>{permissions.name}</Badge>
        ));
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
          <span className="font-mono">{formatDate(original.updatedAt)}</span>
        );
      },
    },
  ];

  return <DataTable columns={columns} data={mappedRoles} />;
}
