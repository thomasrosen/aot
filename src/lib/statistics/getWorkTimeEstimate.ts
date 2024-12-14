import { calculateWorkTime } from "./calculateWorkTime";
import { CommitData, getCommitsByDateRange } from "./getCommitsByDateRange";
import { getWeekNumber } from "./getWeekNumber";

export async function getWorkTimeEstimate({
  startDate,
  endDate,
  granularity,
}: {
  startDate?: string | null;
  endDate?: string | null;
  granularity?: string | null; // | "day" | "week" | "month" | "year";
}) {
  // https://localhost:3000/api/meta/times?start=2024-01-01&end=2024-12-31

  // get start and end date from query
  if (!startDate) {
    throw new Error("Missing start_date query parameter");
  }
  if (!endDate) {
    throw new Error("Missing end_date query parameter");
  }

  // granularity can be day, week, month or year
  if (
    !granularity ||
    (granularity && !["day", "week", "month", "year"].includes(granularity))
  ) {
    granularity = "year";
  }

  // get commits from GitHub API
  if (!process.env.GIT_REPO_ORG || !process.env.GIT_REPO_NAME) {
    throw new Error("Missing GIT_REPO_ORG or GIT_REPO_NAME env variable");
  }
  const commitTimestamps = await getCommitsByDateRange(
    process.env.GIT_REPO_ORG,
    process.env.GIT_REPO_NAME,
    startDate,
    endDate
  );

  // group commits by granularity
  const grouped_commits = commitTimestamps
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .reduce((acc, commit_data) => {
      const { date } = commit_data;
      const commit_date = new Date(date);
      let groupStart: Date | null = null;
      let groupEnd: Date | null = null;
      let key = "";

      switch (granularity) {
        case "day":
          groupStart = new Date(
            commit_date.getFullYear(),
            commit_date.getMonth(),
            commit_date.getDate()
          );
          groupEnd = new Date(groupStart);
          groupEnd.setDate(groupEnd.getDate() + 1);
          key = groupStart.toISOString().split("T")[0];
          break;
        case "week":
          // Start from the first day of the year
          groupStart = new Date(commit_date.getFullYear(), 0, 1);

          // Adjust to the first day of the first week of the year
          groupStart.setDate(groupStart.getDate() - groupStart.getDay() + 1);

          // Calculate the start date of the current week
          groupStart.setDate(
            groupStart.getDate() + (getWeekNumber(commit_date) - 1) * 7
          );

          // Set the end date to 7 days after the start date
          groupEnd = new Date(groupStart);
          groupEnd.setDate(groupEnd.getDate() + 7);

          // Create a key for the week
          key = `${commit_date.getFullYear()}-W${getWeekNumber(commit_date)}`;
          break;
        case "month":
          groupStart = new Date(
            commit_date.getFullYear(),
            commit_date.getMonth(),
            1
          );
          groupEnd = new Date(groupStart);
          groupEnd.setMonth(groupEnd.getMonth() + 1);
          key = `${commit_date.getFullYear()}-${commit_date.getMonth() + 1}`;
          break;
        case "year":
          groupStart = new Date(commit_date.getFullYear(), 0, 1);
          groupEnd = new Date(groupStart);
          groupEnd.setFullYear(groupEnd.getFullYear() + 1);
          key = `${commit_date.getFullYear()}`;
          break;
      }

      acc[key] = acc[key] || {
        start: groupStart,
        end: groupEnd,
        key,
        commits: [],
      };
      acc[key].commits.push(commit_data);
      return acc;
    }, {} as Record<string, { start: Date; end: Date; key: string; commits: CommitData[] }>);

  // calculate work time for each group
  const grouped_commits_with_times = Object.values(grouped_commits).map(
    ({ commits, ...more }) => {
      // estimate work time
      const workTimeMinutes = calculateWorkTime({
        timestamps: commits.map((commit) => commit.date),
        timeBefore: 90,
        timeAfter: 30,
      });
      const workTimeHours = Math.round(workTimeMinutes / 60);

      return {
        ...more,
        commits: commits.length,
        hours: workTimeHours,
      };
    }
  );

  return grouped_commits_with_times;
}
