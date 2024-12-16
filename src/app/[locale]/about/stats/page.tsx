import { SubHeader } from "@/components/SubHeader";
import { TimeChart } from "@/components/client/stats/TimeChats";
import { loadTranslations } from "@/lib/server/fluent-server";
import { getWorkTimeEstimate } from "@/lib/statistics/getWorkTimeEstimate";
import { Locale } from "@@/i18n-config";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{
    locale: Locale;
  }>;
  searchParams: Promise<{
    start?: string;
    end?: string;
    g?: string;
  }>;
}) {
  const { locale } = await params;
  const t = await loadTranslations(locale);

  const today = new Date();
  const lastYear = new Date(
    new Date(today).setFullYear(today.getFullYear() - 1)
  );

  let { start: startDate, end: endDate, g: granularity } = await searchParams;

  if (!startDate) {
    startDate = lastYear.toISOString();
  }
  if (!endDate) {
    endDate = today.toISOString();
  }
  if (!granularity) {
    granularity = "week";
  }

  const data = await getWorkTimeEstimate({
    startDate,
    endDate,
    granularity,
  });

  return (
    <>
      <SubHeader title={t("statistics")} />
      <div className="h-[600px] w-[600px] max-w-full max-h-full">
        <TimeChart
          startDate={startDate}
          endDate={endDate}
          granularity={granularity}
          data={data}
        />
      </div>
    </>
  );
}
