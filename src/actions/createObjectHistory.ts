"use server";

import { auth } from "@/auth";
import { prisma } from "@/prisma";
import { revalidatePath } from "next/cache";

export async function createObjectHistory({
  code,
  location,
  email,
}: {
  code: string;
  location: {
    address: string;
    latitude: number;
    longitude: number;
  };
  email: string;
}): Promise<true> {
  // overwrite email with the signed in user's email
  const session = await auth();
  if (session?.user?.email) {
    email = session.user.email;
  }

  if (!code) {
    throw new Error("Missing code");
  }
  if (!location) {
    throw new Error("Missing location");
  }
  if (!email) {
    throw new Error("Missing email");
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
    },
  });

  revalidatePath(`/view/${code}`); // clear the page cache
  console.log("createObjectHistory", result);

  return true; // todo check result
}
