import { auth } from "@/auth";
import { ObjectViewer } from "@/components/server/ObjectViewer";
import { getObject } from "@/lib/server/getObject";
import { userHasOneOfPermissions } from "@/lib/server/permissions";
import { notFound } from "next/navigation";

export default async function ViewObjectPage({
  params,
}: {
  params: Promise<{
    code: string;
  }>;
}) {
  const session = await auth();
  const isAllowed = await userHasOneOfPermissions({
    userId: session?.user?.id,
    permissionNames: ["view_objects"],
  });
  if (!isAllowed) {
    throw new Error("Not allowed");
  }

  const { code } = await params;
  const object = await getObject({ code });
  if (!object || !object.code) {
    return notFound();
  }

  return <ObjectViewer object={object} session={session} />;
}
