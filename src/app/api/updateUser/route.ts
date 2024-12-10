import { prisma } from "@/prisma";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const adminRoleName = "admin";

    const res = await request.json();

    // Update user with POST body
    // Currently, only admin = true|false is allowed.
    const query = {
      where: { id: res.userId },
      data: {}
    };

    if (res.admin) {
      query.data = {
        ...query.data,
        userRolePairings: {
          connectOrCreate: [
            {
              where: {
                userId_roleName: {
                  userId: res.userId,
                  roleName: adminRoleName,
                }
              },
              create: {
                role: {
                  connect: {
                    name: adminRoleName
                  }
                }
              }
            }
          ]
        }
      }
    } else if (typeof res.admin !== 'undefined' && !res.admin) {
      await prisma.userRolePairing.delete({
        where: {
          userId_roleName: {
            userId: res.userId,
            roleName: adminRoleName,
          }
        },
      });
    }

    const response = await prisma.user.update(query);
    return new Response(JSON.stringify(response), { status: 200 });
  } catch (error) {
    console.error("Error in user upsert:", error);
    return new Response("Error occurred", { status: 500 });
  }
}
