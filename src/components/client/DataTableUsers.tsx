"use client";

import { DataTable } from "@/components/client/DataTable";
import { DataTableSortingHeader } from "@/components/client/DataTableSortingHeader";
import UpdateUserButton from "@/components/client/UpdateUserButton";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/formatDate";
import { UserFull } from "@/types";
import { ColumnDef } from "@tanstack/react-table";

export function DataTableUsers({ data }: { data: UserFull[] }) {
  const columns: ColumnDef<UserFull>[] = [
    {
      accessorKey: "id",
      header: ({ column }) => {
        return (
          <DataTableSortingHeader column={column}>ID</DataTableSortingHeader>
        );
      },
    },
    {
      accessorKey: "email",
      header: ({ column }) => {
        return (
          <DataTableSortingHeader column={column}>Email</DataTableSortingHeader>
        );
      },
    },
    {
      accessorKey: "updatedAt",
      header: ({ column }) => {
        return (
          <DataTableSortingHeader column={column}>
            Last Updated At
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
    {
      accessorKey: "userRolePairings",
      header: ({ column }) => {
        return (
          <DataTableSortingHeader column={column}>Roles</DataTableSortingHeader>
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
        return <div className="sr-only">Actions</div>;
      },
      cell: ({ row }) => {
        const original = row.original;
        return <UpdateUserButton user={original} />;
      },
    },
  ];

  return <DataTable columns={columns} data={data} />;
}
