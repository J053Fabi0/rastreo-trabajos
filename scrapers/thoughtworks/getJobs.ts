import dayjs from "dayjs";
import Job, { Company } from "../../data/models/job.model.ts";
import StringWithSuggestions from "../../types/stringWithSuggestions.type.ts";

interface Posteno {
  location: string;
  country: string;
  role: string;
  jobFunctions: string[];
  remoteEligible: boolean;
  name: string;
  sourceSystemId: number;
  updatedAt: StringWithSuggestions<"2026-07-09T06:02:41-04:00">;
}

interface Response {
  jobs: Posteno[];
}

export default async function getJobs(): Promise<Job[]> {
  const res = await fetch("https://www.thoughtworks.com/rest/careers/jobs", {
    headers: {
      "accept": "*/*",
      "accept-language": "eo,en-US;q=0.9,en;q=0.8,es;q=0.7,ja;q=0.6",
      "cache-control": "no-cache",
      "content-type": "application/json",
      "pragma": "no-cache",
      "priority": "u=1, i",
      "sec-ch-ua": '"Chromium";v="148", "Google Chrome";v="148", "Not/A)Brand";v="99"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Linux"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "Referer": "https://www.thoughtworks.com/careers/jobs",
    },
    body: null,
    method: "GET",
  });

  const json: Response = await res.json();

  const jobs: Job[] = [];
  for (const data of json.jobs) {
    let description = data.location;
    if (data.country) description += `, ${data.country}`;
    description += `. ${data.role}. `;
    description += data.jobFunctions.join(", ");
    description += `. ${data.remoteEligible ? "R" : "No r"}emoto`;

    jobs.push({
      company: Company.THOUGHTWORKS,
      date: dayjs(data.updatedAt).toDate(),
      description,
      title: data.name,
      url: `https://www.thoughtworks.com/careers/jobs/${data.sourceSystemId}`,
    });
  }

  return jobs;
}
