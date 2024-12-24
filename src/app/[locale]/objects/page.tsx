import { auth } from "@/auth";
import { SubHeader } from "@/components/SubHeader";
import { CreateObjectDialogButton } from "@/components/client/CreateObjectDialogButton";
import { ObjectsList } from "@/components/client/ObjectsList";
import { loadTranslations } from "@/lib/server/fluent-server";
import { userHasOneOfPermissions } from "@/lib/server/permissions";
import { Locale, SUPPORTED_LOCALES } from "@@/i18n-config";

export function generateStaticParams() {
  // Generate static params for all locales
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export default async function ObjectsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const session = await auth();
  const isAllowed = await userHasOneOfPermissions({
    userId: session?.user?.id,
    permissionNames: [],
  });
  if (!isAllowed) {
    throw new Error("Not allowed");
  }

  const canCreateObject = await userHasOneOfPermissions({
    userId: session?.user?.id,
    permissionNames: ["create_objects"],
  });

  const { locale } = await params;
  const t = loadTranslations(locale);

  return (
    <>
      <SubHeader
        title={t("objects")}
        actions={<>{canCreateObject ? <CreateObjectDialogButton /> : null}</>}
      />

      <ObjectsList />
    </>
  );
}
