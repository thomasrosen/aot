"use client";

import { Button } from "@/components/ui/button";
import { Column } from "@tanstack/react-table";

export function DataTableSortingHeader({
  children,
  column,
}: {
  children?: React.ReactNode;
  column: Column<any, any>;
}) {
  const isSorted = column.getIsSorted();
  const isAsc = isSorted === "asc";

  return (
    <Button
      className="w-full justify-between"
      variant="ghost"
      onClick={() => column.toggleSorting(isAsc)}
    >
      {children}
      {isSorted ? isAsc ? <span>🔼</span> : <span>🔽</span> : null}
    </Button>
  );
}
