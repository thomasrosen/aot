import { getWorkTimeEstimate } from "@/lib/statistics/getWorkTimeEstimate";

export async function GET(request: Request): Promise<Response> {
  // https://localhost:3000/api/meta/times?start=2024-01-01&end=2024-12-31

  // get start and end date from query
  const url = new URL(request.url);
  const startDate = url.searchParams.get("start");
  const endDate = url.searchParams.get("end");
  const granularity = url.searchParams.get("g");

  const grouped_commits_with_times = await getWorkTimeEstimate({
    startDate,
    endDate,
    granularity,
  });

  return Response.json({
    times: grouped_commits_with_times,
  });
}
