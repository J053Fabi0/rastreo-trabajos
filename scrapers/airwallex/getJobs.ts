import Job, { Company } from "../../data/models/job.model.ts";
import type StringWithSuggestions from "../../types/stringWithSuggestions.type.ts";

interface Team {
  id: StringWithSuggestions<"466e05be-6d05-4fa1-a86f-8f9586b9399a">;
  name: StringWithSuggestions<"Engineering">;
  parentTeamId: null | StringWithSuggestions<"320fb36b-08a4-42a1-960b-3e5deeff9695">;
}

interface JobPosting {
  id: string;
  title: string;
  teamId: string;
  locationId: string;
  locationName: string;
  workplaceType: null | StringWithSuggestions<"OnSite" | "Hybrid">;
  employmentType: StringWithSuggestions<"FullTime">;
  compensationTierSummary: null | StringWithSuggestions<"$175K - $210K • Offers Equity • Offers Bonus">;
}

interface DataRaw {
  data: {
    jobBoard: {
      teams: Team[];
      jobPostings: JobPosting[];
    };
  };
}

const query = `
  query ApiJobBoardWithTeams($organizationHostedJobsPageName: String!) {
    jobBoard: jobBoardWithTeams(
      organizationHostedJobsPageName: $organizationHostedJobsPageName
    ) {
      teams {
        id
        name
        externalName
        parentTeamId
      }
      jobPostings {
        id
        title
        teamId
        locationId
        locationName
        workplaceType
        employmentType
        secondaryLocations {
          ...JobPostingSecondaryLocationParts
        }
        compensationTierSummary
      }
    }
  }

  fragment JobPostingSecondaryLocationParts on JobPostingSecondaryLocation {
    locationId
    locationName
  }
`;

const teamNamesToSearch = ["Engineering"];

export default async function getJobs(): Promise<Job[]> {
  const response = await fetch("https://jobs.ashbyhq.com/api/non-user-graphql?op=ApiJobBoardWithTeams", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      query,
      operationName: "ApiJobBoardWithTeams",
      variables: { organizationHostedJobsPageName: "airwallex" },
    }),
  });

  const { data } = (await response.json()) as DataRaw;

  const teams: Team[] = [];
  for (const name of teamNamesToSearch)
    for (const team of data.jobBoard.teams) {
      if (team.name.toLowerCase() === name.toLowerCase()) {
        teams.push(team);
        teams.push(...getChildrenTeams(team.id, data.jobBoard.teams));
      }
    }
  const teamById = new Map<string, Team>();
  for (const team of teams) teamById.set(team.id, team);

  const jobs: Job[] = [];
  const now = new Date();
  for (const job of data.jobBoard.jobPostings) {
    const team = teamById.get(job.teamId);
    if (team === undefined) continue;

    let description = `${team.name} - ${job.locationName}`;
    if (job.workplaceType) description += ` - ${job.workplaceType}`;

    jobs.push({
      date: now,
      description,
      title: job.title,
      company: Company.AIRWALLEX,
      url: `https://jobs.ashbyhq.com/airwallex/${job.id}`,
    });
  }

  return jobs;
}

function getChildrenTeams(id: string, teams: Team[]): Team[] {
  const foundTeams: Team[] = [];
  for (const team of teams) {
    if (team.parentTeamId === id) {
      foundTeams.push(team);
      foundTeams.push(...getChildrenTeams(team.id, teams));
    }
  }
  return foundTeams;
}

await getJobs();
