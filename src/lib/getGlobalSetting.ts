import { prisma } from "@/prisma";

export async function getGlobalSetting({
  key,
}: {
  key: string;
}): Promise<ReturnType<typeof JSON.parse> | null> {
  const data = await prisma.globalSetting.findFirst({
    where: { key },
    orderBy: { updatedAt: "desc" },
    select: {
      value: true,
    },
  });

  if (data) {
    return JSON.parse(data.value);
  }

  return null;
}
