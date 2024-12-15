import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

export function NavMenu({ isAdmin }: { isAdmin: boolean }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Menu</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuLabel>Menu</DropdownMenuLabel>
        {/* <Link href="/">
          <DropdownMenuItem>Start</DropdownMenuItem>
        </Link> */}
        <Link href="/objects">
          <DropdownMenuItem>Objects</DropdownMenuItem>
        </Link>
        <Link href="/about">
          <DropdownMenuItem>About</DropdownMenuItem>
        </Link>
        <Link href="/about/stats">
          <DropdownMenuItem>Statistics</DropdownMenuItem>
        </Link>

        {isAdmin ? (
          <>
            <DropdownMenuSeparator />

            <DropdownMenuLabel>Admin Menu</DropdownMenuLabel>
            <Link href="/users">
              <DropdownMenuItem>Users</DropdownMenuItem>
            </Link>
            <Link href="/roles">
              <DropdownMenuItem>Roles</DropdownMenuItem>
            </Link>
            <Link href="/permissions">
              <DropdownMenuItem>Permissions</DropdownMenuItem>
            </Link>
          </>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
