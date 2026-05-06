import checkJobs from "./checkJobs.ts";
import getTime from "../utils/getTime.ts";

Deno.cron("checkSales", { hour: { every: 8 } }, checkJobs);

console.log("Crons started", getTime());
