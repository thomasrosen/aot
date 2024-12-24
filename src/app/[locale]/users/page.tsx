import { auth } from "@/auth";
import { SubHeader } from "@/components/SubHeader";
import { DataTableUsers } from "@/components/client/DataTableUsers";
import { loadTranslations } from "@/lib/server/fluent-server";
import { userHasOneOfPermissions } from "@/lib/server/permissions";
import { Locale, SUPPORTED_LOCALES } from "@@/i18n-config";

export function generateStaticParams() {
  // Generate static params for all locales
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export default async function UsersPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = loadTranslations(locale);

  const session = await auth();
  const isAllowed = await userHasOneOfPermissions({
    userId: session?.user?.id,
    permissionNames: ["admin"],
  });
  if (!isAllowed) {
    throw new Error("Not allowed");
  }

  return (
    <>
      <SubHeader title={t("users")} />
      <DataTableUsers />
    </>
  );
}
