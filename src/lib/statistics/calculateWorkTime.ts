export function calculateWorkTime({
  timestamps,
  timeBefore = 60,
  timeAfter = 30,
}: {
  timestamps: string[];
  timeBefore?: number;
  timeAfter?: number;
}): number {
  if (!Array.isArray(timestamps) || timestamps.length === 0) {
    return 0;
  }

  const intervals: [Date, Date][] = timestamps.map((timestamp) => {
    const date = new Date(timestamp);
    return [
      new Date(date.getTime() - timeBefore * 60 * 1000),
      new Date(date.getTime() + timeAfter * 60 * 1000),
    ];
  });

  intervals.sort((a, b) => a[0].getTime() - b[0].getTime());

  const mergedIntervals: [Date, Date][] = [];
  let currentInterval = intervals[0];

  for (let i = 1; i < intervals.length; i++) {
    const [currentStart, currentEnd] = currentInterval;
    const [nextStart, nextEnd] = intervals[i];

    if (nextStart.getTime() <= currentEnd.getTime()) {
      currentInterval = [
        currentStart,
        new Date(Math.max(currentEnd.getTime(), nextEnd.getTime())),
      ];
    } else {
      mergedIntervals.push(currentInterval);
      currentInterval = intervals[i];
    }
  }

  mergedIntervals.push(currentInterval);

  const totalWorkTime = mergedIntervals.reduce((total, [start, end]) => {
    return total + (end.getTime() - start.getTime()) / (1000 * 60);
  }, 0);

  return totalWorkTime;
}
