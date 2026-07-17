import dayjs from "dayjs";
import getToken from "./getToken.ts";
import Job, { Company } from "../../data/models/job.model.ts";
import StringWithSuggestions from "../../types/stringWithSuggestions.type.ts";

interface Posteno {
  requisitionId: number;
  displayJobTitle: string;
  externalDescription: string;
  postingExpirationDate: string;
  locations: { country: string }[];
  postingEffectiveDate: StringWithSuggestions<"16/07/2026">;
}

interface Response {
  data: {
    totalCount: number;
    requisitions: Posteno[];
  };
}

export default async function getJobs(): Promise<Job[]> {
  const token = await getToken();

  const res = await fetch("https://eu-fra.api.csod.com/rec-job-search/external/jobs", {
    headers: { "content-type": "application/json", "Authorization": `Bearer ${token}` },
    body: JSON.stringify({
      states: [],
      cities: [],
      placeID: "",
      cultureId: 2,
      radius: null,
      pageNumber: 1,
      pageSize: 2500,
      searchText: "",
      careerSiteId: 1,
      countryCodes: [],
      careerSitePageId: 1,
      cultureName: "en-GB",
      customFieldRadios: [],
      postingsWithinDays: null,
      customFieldDropdowns: [],
      customFieldCheckboxKeys: [],
    }),
    method: "POST",
  });

  const json: Response = await res.json();

  const jobs: Job[] = [];
  for (const data of json.data.requisitions) {
    const locations = data.locations.map((l) => l.country).join(", ");
    jobs.push({
      company: Company.VASS,
      title: data.displayJobTitle,
      date: dayjs(data.postingEffectiveDate, "DD/MM/YYYY").toDate(),
      description: `Ubicado en ${locations}. ${data.externalDescription}`,
      url: `https://vasscompany.csod.com/ux/ats/careersite/1/home/requisition/${data.requisitionId}`,
    });
  }

  return jobs;
}
