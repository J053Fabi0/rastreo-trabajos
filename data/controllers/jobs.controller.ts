import db from "../database.ts";
import Job from "../models/job.model.ts";

export async function getAllJobs() {
  const { result } = await db.jobs.getMany();
  return result;
}

export function addJob(job: Job) {
  return db.jobs.add(job);
}
