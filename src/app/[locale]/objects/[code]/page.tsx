import { auth } from "@/auth";
import { userHasOneOfPermissions } from "@/lib/server/permissions";
import { Locale, SUPPORTED_LOCALES } from "@@/i18n-config";
import { ViewObjectPageClient } from "./ViewObjectPageClient";

export function generateStaticParams() {
  // Generate static params for all locales
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export default async function ViewObjectPage({
  params,
}: {
  params: Promise<{
    locale: Locale;
    code: string;
  }>;
}) {
  const { code } = await params;

  if (!code) {
    return null;
  }

  const session = await auth();
  const isAllowed = await userHasOneOfPermissions({
    userId: session?.user?.id,
    permissionNames: ["view_objects"],
  });
  if (!isAllowed) {
    throw new Error("Not allowed");
  }

  // const object = await getObject({ code });
  // if (!object || !object.code) {
  //   return notFound();
  // }

  const canRenameObject = await userHasOneOfPermissions({
    userId: session?.user?.id,
    permissionNames: ["rename_objects"],
  });

  return <ViewObjectPageClient code={code} canRenameObject={canRenameObject} />;
}
