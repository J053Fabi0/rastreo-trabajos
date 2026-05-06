import { USERS_ID } from "../env.ts";
import { Document } from "@olli/kvdex";
import bot from "../telegram/initBot.ts";
import Job from "../data/models/job.model.ts";
import getJobCaption from "../utils/getJobCaption.ts";
import getGrabJobs from "../scrapers/grab/getJobs.ts";
import { FormattedString } from "@grammyjs/parse-mode";
import getAirwallexJobs from "../scrapers/airwallex/getJobs.ts";
import { addJob, getAllJobs } from "../data/controllers/jobs.controller.ts";

// deno-lint-ignore no-explicit-any
function handleError(error: any, message?: string) {
  console.error(error);

  if (message)
    for (const user of USERS_ID)
      bot.api.sendMessage(user, message, { link_preview_options: { is_disabled: true } }).catch(console.error);
}

export default async function checkJobs() {
  const allJobs: Job[] = [];

  const airwallexJobs = await getAirwallexJobs().catch((e) => handleError(e, "airwallex no funciona"));
  if (airwallexJobs) allJobs.push(...airwallexJobs);

  const grabJobs = await getGrabJobs().catch((e) => handleError(e, "grab no funciona"));
  if (grabJobs) allJobs.push(...grabJobs);

  const allDbJobs = await getAllJobs();
  const allDbJobsByUrl = new Map<string, Document<Job, string>>();
  for (const j of allDbJobs) allDbJobsByUrl.set(j.value.url, j);

  const messagesToSend: FormattedString[] = [];
  for (const job of allJobs) {
    const matchingDbJob = allDbJobsByUrl.get(job.url);
    // nueva
    if (matchingDbJob === undefined) {
      await addJob(job);
      messagesToSend.push(getJobCaption(job));
    }
  }

  for (const user of USERS_ID)
    for (const c of messagesToSend)
      await bot.api
        .sendMessage(user, c.caption, {
          entities: c.entities,
          link_preview_options: { is_disabled: true },
        })
        .catch((e) => handleError(e, "sendMessage failed"));
}
