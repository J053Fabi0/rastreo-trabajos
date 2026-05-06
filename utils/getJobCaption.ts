import Job from "../data/models/job.model.ts";
import { fmt, b, u, link, FormattedString } from "@grammyjs/parse-mode";

export default function getJobCaption(job: Job): FormattedString {
  const messages: FormattedString[] = [];

  // nombre
  messages.push(fmt`${link(job.url)}${u}${b}${job.title}${b}${u}${link}`.plain("\n"));
  messages.push(fmt`${job.company}`.plain("\n"));
  messages.push(fmt`${job.description}`);

  return new FormattedString("").concat(...messages);
}
