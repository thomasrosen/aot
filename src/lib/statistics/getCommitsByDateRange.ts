type ResponseCommit = {
  commit: {
    author: {
      date: string;
    };
  };
};

export type CommitData = {
  date: string;
};

export async function getCommitsByDateRange(
  owner: string,
  repo: string,
  startDate: string,
  endDate: string
): Promise<CommitData[]> {
  const commits: CommitData[] = [];
  let page = 1;
  const maxPages = 100; // Set a reasonable maximum to prevent infinite loops.

  try {
    while (page <= maxPages) {
      const response = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/commits?` +
          `since=${startDate}&until=${endDate}&` +
          `per_page=100&page=${page}`,
        {
          headers: {
            Authorization: `token ${process.env.GITHUB_TOKEN}`,
          },
        }
      );

      if (!response.ok) {
        console.error(
          `Error fetching commits: ${response.status} - ${response.statusText}`
        );
        break;
      }

      const batch: ResponseCommit[] = await response.json();
      if (batch.length === 0) {
        break;
      }

      const dates = batch.map((commit) => ({
        date: commit.commit.author.date,
      }));
      commits.push(...dates);
      page++;
    }

    if (page > maxPages) {
      console.warn(
        "Maximum page limit reached, some commits might be missing."
      );
    }
  } catch (error) {
    console.error("An error occurred while fetching commits:", error);
  }

  return commits;
}
