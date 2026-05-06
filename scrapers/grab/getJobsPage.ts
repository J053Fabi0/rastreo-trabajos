import { DOMParser } from "@b-fuze/deno-dom";
import Job, { Company } from "../../data/models/job.model.ts";

interface ToReturn {
  jobs: Job[];
  hasNext: boolean;
}

const pagesize = 20;

/**
 * Por algún motivo, page no funciona, siempre es como si fuera 1
 * Incluso copiando el fetch original con headers y cookies
 * Pero con curl en la terminal sí funciona, sin necesidad de ningún header
 */
export default async function getJobsPage(page: number): Promise<ToReturn> {
  const url = new URL("https://www.grab.careers/en/jobs");
  url.searchParams.set("team", "Engineering");
  url.searchParams.set("country", "Singapore");
  url.searchParams.set("pagesize", pagesize.toString());
  if (page >= 2) url.searchParams.set("page", page.toString());

  const htmlString = await (await fetch(url.toString())).text();

  const dom = new DOMParser().parseFromString(htmlString, "text/html");

  const jobElements = dom.querySelectorAll(".card-job");
  const jobs: Job[] = [];
  const now = new Date();

  for (const jobElement of jobElements) {
    const title = jobElement.querySelector("h2")?.innerText ?? null;
    const url = jobElement.querySelector("h2 > a")?.getAttribute("href") ?? null;
    if (title && url)
      jobs.push({
        title,
        date: now,
        description: "",
        company: Company.GRAB,
        url: `https://www.grab.careers${url}`,
      });
  }

  return { jobs, hasNext: jobElements.length >= pagesize };
}
