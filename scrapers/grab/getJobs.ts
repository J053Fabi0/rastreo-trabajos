import getJobsPage from "./getJobsPage.ts";
import Job from "../../data/models/job.model.ts";

export default async function getJobs(): Promise<Job[]> {
  const jobsByUrl = new Map<string, Job>();

  let page = 1;
  do {
    const { jobs, hasNext } = await getJobsPage(page++);

    const prevSize = jobsByUrl.size;
    for (const job of jobs) jobsByUrl.set(job.url, job);

    const change = jobsByUrl.size - prevSize;
    if (hasNext === false || change !== jobs.length) break;
  } while (true);

  return Array.from(jobsByUrl.values());
}
