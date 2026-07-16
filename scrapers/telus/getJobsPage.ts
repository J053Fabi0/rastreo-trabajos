import { ToReturn } from "../grab/getJobsPage.ts";
import decodeHtml from "../../utils/decodeHtml.ts";
import Job, { Company } from "../../data/models/job.model.ts";

interface Data {
  score: number;
  hiring_language: {
    id: number;
    name: string;
    iso2: string;
    iso3: string;
  };
  job_type: string;
  project_id: string;
  employment_type: string;
  compensation: {
    amount: number;
    currency: string;
    unit: string;
    normalized_usd: number;
  };
  status: string;
  description: string;
  title: string;
  id: string;
  ctime: string;
}

interface Response {
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  data: Data[];
}

export default async function getJobsPage(page: number): Promise<ToReturn> {
  const res = await fetch("https://api.telusinternational.ai/apapi/v1/jobs-entry/list-job-posts", {
    headers: { "content-type": "application/json", "accept": "application/json, text/plain, */*" },
    body: JSON.stringify({ filters: {}, page, limit: 100 }),
    method: "POST",
  });

  const json: Response = await res.json();

  const jobs: Job[] = [];

  for (const jobElement of json.data) {
    const title = jobElement.title;
    const url = `https://app.telusinternational.ai/contributor/jobs/available/${jobElement.id}`;
    const description = decodeHtml(jobElement.description);
    jobs.push({
      url,
      title,
      date: new Date(jobElement.ctime),
      company: Company.TELUS,
      description: description.trim(),
    });
  }

  return { jobs, hasNext: json.pagination.page !== json.pagination.pages };
}
