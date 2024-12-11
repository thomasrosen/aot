import { auth } from "@/auth";
import UpdateUserButton from "@/components/client/UpdateUserButton";
import { H2 } from "@/components/Typography";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { userHasOneOfPermissions } from "@/lib/permissions";
import { prisma } from "@/prisma";
import { UserFull } from "@/types";

const UserRow = ({ key, user }: { key: string; user: UserFull }) => {
  const { id, email, updatedAt, userRolePairings } = user;

  return (
    <TableRow key={key}>
      <TableCell>{id}</TableCell>
      <TableCell>{email}</TableCell>
      <TableCell>{updatedAt.toString()}</TableCell>
      <TableCell>
        {userRolePairings.map((r: any) => r.role.name).join(", ")}
      </TableCell>
      <TableCell>
        <UpdateUserButton user={user} />
      </TableCell>
    </TableRow>
  );
};

export default async function UsersPage() {
  const session = await auth();
  const isAllowed = await userHasOneOfPermissions({
    userId: session?.user?.id,
    permissionNames: ["admin"],
  });
  if (!isAllowed) {
    throw new Error("Not allowed");
  }

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      image: true,
      email: true,
      emailVerified: true,
      createdAt: true,
      updatedAt: true,
      userRolePairings: {
        select: {
          role: {
            select: {
              name: true,
              permissions: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      },
    },
    orderBy: {
      email: "asc",
    },
  });

  return (
    <>
      <H2>Users</H2>
      <Table>
        <TableCaption>A list of all users.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Last Updated At</TableHead>
            <TableHead>Roles</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((u) => (
            <UserRow key={`USER:${u.id}`} user={u} />
          ))}
        </TableBody>
      </Table>
    </>
  );
}
