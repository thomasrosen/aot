"use server";

import { prisma } from "@/prisma";
import { revalidatePath } from "next/cache";

export async function renameObject({
  code,
  name,
}: {
  code: string;
  name: string;
}) {
  try {
    const result = await prisma.object.update({
      where: {
        code,
      },
      data: {
        name,
      },
    });

    if (result) {
      revalidatePath(`/view/${code}`); // clear the page cache
      return true;
    }
  } catch (error) {
    console.error("ERROR_SpnCPuN6", error);
  }

  return false;
}