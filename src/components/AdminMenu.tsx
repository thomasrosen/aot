import { Button } from "@/components/ui/button";
import Link from "next/link";

export function AdminMenu() {
  return (
    <>
      <Link href="/users">
        <Button variant="outline">Users</Button>
      </Link>
      <Link href="/roles">
        <Button variant="outline">Roles</Button>
      </Link>
      <Link href="/permissions">
        <Button variant="outline">Permissions</Button>
      </Link>
    </>
  );
}
