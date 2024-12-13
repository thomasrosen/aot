import { Button } from "@/components/ui/button";
import Link from "next/link";

export function AdminMenu() {
  return (
    <>
      <Link href="/objects">
        <Button variant="ghost">Objects</Button>
      </Link>
      <Link href="/users">
        <Button variant="ghost">Users</Button>
      </Link>
      <Link href="/roles">
        <Button variant="ghost">Roles</Button>
      </Link>
      <Link href="/permissions">
        <Button variant="ghost">Permissions</Button>
      </Link>
    </>
  );
}
