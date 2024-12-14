import { SubHeader } from "@/components/SubHeader";
import { TimeChart } from "@/components/client/stats/TimeChats";
import { getWorkTimeEstimate } from "@/lib/statistics/getWorkTimeEstimate";

export default async function Page({ searchParams }: { searchParams: any }) {
  const today = new Date();
  const lastYear = new Date(
    new Date(today).setFullYear(today.getFullYear() - 1)
  );

  const startDate = (await searchParams.start) || lastYear.toISOString();
  const endDate = (await searchParams.end) || today.toISOString();
  const granularity = (await searchParams.g) || "week";

  const data = await getWorkTimeEstimate({
    startDate,
    endDate,
    granularity,
  });

  return (
    <>
      <SubHeader title="Statistics" />
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
