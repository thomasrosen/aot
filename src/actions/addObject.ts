"use server";

import { generateCode } from "@/lib/generateCode";
import { prisma } from "@/prisma";

export async function addObject() {
  const code = await generateCode();
  console.log("addObject-code", code);

  // create new empty object with prisma
  const data = await prisma.object.create({
    data: { code },
  });

  console.log("addObject-data", data);

  if (!data) {
    throw new Error("ERROR_Qy0Mf3wB Failed to create object");
  }

  return code;
}
