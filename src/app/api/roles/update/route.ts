import { auth } from "@/auth";
import {
  giveUserRole,
  takeUserRole,
  toggleUserRole,
  userHasOneOfPermissions,
} from "@/lib/server/permissions";
import { revalidatePath } from "next/cache";
import { NextRequest } from "next/server";
import z from "zod";

const bodySchema = z.object({
  userId: z.string(),
  roleName: z.string(),
  action: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    // needs to be admin to change roles
    const session = await auth();
    const isAllowed = await userHasOneOfPermissions({
      userId: session?.user?.id,
      permissionNames: ["admin"],
    });
    if (!isAllowed) {
      throw new Error("Not allowed");
    }

    // get properties from the body
    const bodyJson = await request.json();
    const validationResult = bodySchema.safeParse(bodyJson);

    if (!validationResult.success) {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid request body" }),
        { status: 400 }
      );
    }

    const { userId, roleName, action } = validationResult.data;

    // do the action
    let responseBoolean = false;
    if (action === "give") {
      responseBoolean = await giveUserRole({
        userId,
        roleName,
      });
    } else if (action === "take") {
      responseBoolean = await takeUserRole({
        userId,
        roleName,
      });
    } else if (action === "toggle") {
      responseBoolean = await toggleUserRole({
        userId,
        roleName,
      });
    }

    revalidatePath("/users");

    // return a response
    return new Response(
      JSON.stringify({
        success: responseBoolean,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in user upsert:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Unknown Error" }),
      { status: 500 }
    );
  }
}
