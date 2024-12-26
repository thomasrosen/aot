"use client";

import { DataTable } from "@/components/client/DataTable";
import { DataTableSortingHeader } from "@/components/client/DataTableSortingHeader";
import { useTranslations } from "@/components/client/Translation";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/formatDate";
import { useRelations } from "@/lib/relations";
import { RoleFull } from "@/prisma_types";
import { ColumnDef } from "@tanstack/react-table";

export function DataTableRoles() {
  const t = useTranslations();

  const roles = useRelations<RoleFull>({
    query: {
      tableName: "roles",
      include: {
        rolePermissionPairings: {
          include: {
            permission: true,
          },
        },
      },
    },
  });

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

        return (original?.rolePermissionPairings || [])
          .filter((rolePermissionPairing) => rolePermissionPairing.permission)
          .map((rolePermissionPairing) => {
            if (!rolePermissionPairing.permission) {
              // Only here for typescript. This should never happen cause of the filter above.
              return null;
            }
            return (
              <Badge key={rolePermissionPairing.permission.name}>
                {rolePermissionPairing.permission.name}
              </Badge>
            );
          });
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

  return <DataTable columns={columns} data={roles} />;
}
