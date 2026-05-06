import getJobsPage from "./getJobsPage.ts";

export default async function getJobs() {
  const { jobs } = await getJobsPage(1);
  return jobs;
}

await getJobs();
