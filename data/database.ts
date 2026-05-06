import Job from "./models/job.model.ts";
import { collection, kvdex, model } from "@olli/kvdex";

const kv = await Deno.openKv();

const db = kvdex({
  kv,
  schema: {
    jobs: collection(model<Job>(), {
      indices: {
        url: "primary",
        company: "secondary",
      },
    }),
  },
});

export default db;
