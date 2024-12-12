import { giveUserRole } from "@/lib/permissions";
import { prisma } from "@/prisma";

export async function GET() {
  try {
    // only allow this route to be called in development
    if (process.env.NODE_ENV !== "development") {
      return new Response("Not allowed", { status: 403 });
    }

    // get the default admin email from the environment variables
    const adminEmail = process.env.DEFAULT_ADMIN_EMAIL;
    if (!adminEmail) {
      console.error("DEFAULT_ADMIN_EMAIL environment variable not set");
      return new Response("Error occurred", { status: 500 });
    }

    const adminRoleName = "admin";
    const adminPermissionName = "admin";

    // create admin user if it doesn't exist
    const adminUser = await prisma.user.upsert({
      where: { email: adminEmail },
      update: {
        email: adminEmail,
      },
      create: {
        email: adminEmail,
      },
    });

    // create admin role and admin permission if they don't exist
    await prisma.role.upsert({
      where: { name: adminRoleName },
      update: {
        name: adminRoleName,
        permissions: {
          connectOrCreate: [
            {
              where: {
                name: adminPermissionName,
              },
              create: {
                name: adminPermissionName,
              },
            },
          ],
        },
      },
      create: {
        name: adminRoleName,
        permissions: {
          connectOrCreate: [
            {
              where: {
                name: adminPermissionName,
              },
              create: {
                name: adminPermissionName,
              },
            },
          ],
        },
      },
    });

    // connect admin user to admin role
    await giveUserRole({
      userId: adminUser.id,
      roleName: adminRoleName,
    });

    return new Response("GET request received", { status: 200 });
  } catch (error) {
    console.error("Error in user upsert:", error);
    return new Response("Error occurred", { status: 500 });
  }
}
