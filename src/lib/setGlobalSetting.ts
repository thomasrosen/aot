import { prisma } from "@/prisma";

export async function setGlobalSetting({
  key,
  value,
}: {
  key: string;
  value: any; // The input type for the value in JSON.stringify is really any.
}): Promise<boolean> {
  const newSetting = await prisma.globalSetting.create({
    data: {
      key,
      value: JSON.stringify(value),
    },
  });

  if (newSetting) {
    return true;
  }

  return false;
}