import { auth } from "@/auth";
import { ObjectViewer } from "@/components/server/ObjectViewer";
import { getObject } from "@/lib/getObject";
import { notFound } from "next/navigation";

export default async function ViewObject({
  params,
}: {
  params: Promise<{
    code: string;
  }>;
}) {
  const { code } = await params;

  const object = await getObject({ code });

  if (!object || !object.code) {
    return notFound();
  }

  const session = await auth();

  return <ObjectViewer object={object} session={session} />;
}
