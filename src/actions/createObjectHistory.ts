"use server";

import { auth, signIn } from "@/auth";
import { prisma } from "@/prisma";
import { revalidatePath } from "next/cache";

export async function createObjectHistory({
  code,
  location,
  email,
}: {
  code: string;
  location?: {
    address: string;
    latitude: number;
    longitude: number;
  };
  email?: string;
}): Promise<true> {
  // overwrite email with the signed in user's email
  const session = await auth();
  let isSignedIn = false;
  if (session?.user?.email) {
    email = session.user.email;
    isSignedIn = true;
  }

  if (!code) {
    throw new Error("Missing code");
  }
  if (!location) {
    throw new Error("Missing location");
  }
  if (!email) {
    throw new Error(
      "Missing email. Email will automatically be set to the signed in user's email. If not signed in, email is required."
    );
  }

  try {
    const object = await prisma.object.findUnique({
      where: {
        code,
      },
    });

    if (!object) {
      throw new Error("Object not found. Maybe the object code is incorrect.");
    }

    const result = await prisma.objectHistory.create({
      data: {
        object: {
          connect: {
            code,
          },
        },
        location: {
          create: location,
        },
        user: {
          connectOrCreate: {
            create: {
              email,
            },
            where: {
              email,
            },
          },
        },
        verifiedHistoryEntry: isSignedIn ? new Date() : null,
      },
    });

    if (!result) {
      throw new Error("Failed to create object history");
    }

    revalidatePath(`/objects/${code}`); // clear the page cache

    // send verification email
    if (!isSignedIn) {
      // only send when not signed in
      // this will first sign in the user and then redirect to the verifyObjectHistory page
      const history_id = result.id;
      await signIn("email_signin", {
        change: `
        New Location: ${location.address}
        New Geo-Coordinates: ${location.latitude}, ${location.longitude}
        Date of Submission: ${new Date().toLocaleString("de-DE")}
`,
        code,
        email,
        is_object_history_verify_request: true,
        redirect: false,
        redirectTo: `/verifyObjectHistory?id=${history_id}`,
      });
    }
  } catch (error) {
    throw error;
  }

  return true;
}
