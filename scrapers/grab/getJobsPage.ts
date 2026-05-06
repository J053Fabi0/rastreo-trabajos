import { curl } from "@spawn/curl";
import { DOMParser } from "@b-fuze/deno-dom";
import Job, { Company } from "../../data/models/job.model.ts";

interface ToReturn {
  jobs: Job[];
  hasNext: boolean;
}

const pagesize = 20;

export default async function getJobsPage(page: number): Promise<ToReturn> {
  const url = new URL("https://www.grab.careers/en/jobs");
  url.searchParams.set("team", "Engineering");
  url.searchParams.set("country", "Singapore");
  url.searchParams.set("pagesize", pagesize.toString());
  if (page >= 2) url.searchParams.set("page", page.toString());

  const htmlString = await curl([
    url.toString(),
    "-H",
    "user-agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36",
  ]).text();

  const dom = new DOMParser().parseFromString(htmlString, "text/html");

  const jobElements = dom.querySelectorAll(".card-job");
  const jobs: Job[] = [];
  const now = new Date();

  for (const jobElement of jobElements) {
    const title = jobElement.querySelector("h2")?.innerText ?? null;
    const url = jobElement.querySelector("h2 > a")?.getAttribute("href") ?? null;
    const description = jobElement.querySelector("ul.job-meta > li:nth-child(2)")?.innerText ?? "";
    if (title && url)
      jobs.push({
        title,
        date: now,
        company: Company.GRAB,
        description: description.trim(),
        url: `https://www.grab.careers${url}`,
      });
  }

  const isAll = jobElements.length < pagesize || Boolean(dom.querySelector("ul.pagination > li.next")) === false;

  return { jobs, hasNext: isAll === false };
}
