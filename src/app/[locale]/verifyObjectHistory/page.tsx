import { verifyObjectHistory } from "@/actions/verifyObjectHistory";
import { SubHeader } from "@/components/SubHeader";
import { P } from "@/components/Typography";
import { loadTranslations } from "@/lib/server/fluent-server";
import { Locale } from "@@/i18n-config";

export default async function VerifyObjectHistoryPage({
  params,
  searchParams,
}: {
  params: { locale: Locale };
  searchParams: { id: string };
}) {
  const { id } = await searchParams;
  const { locale } = await params;
  const t = loadTranslations(locale);

  try {
    const verifySuccessfull = await verifyObjectHistory({ id });
    if (verifySuccessfull) {
      return (
        <div>
          <SubHeader title={t("verify-object-history")} />
          <P>{t("verify-object-history-successful")}</P>
        </div>
      );
    }
  } catch (error) {
    const error_message =
      error instanceof Error ? error.message : String(error);
    return (
      <div>
        <SubHeader title={t("verify-object-history")} />
        <P>{t("verify-object-history-failed")}</P>
        <P>{t("error", { message: error_message })}</P>
      </div>
    );
  }
}
