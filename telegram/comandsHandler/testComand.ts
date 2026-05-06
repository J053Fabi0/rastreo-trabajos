import checkJobs from "../../crons/checkJobs.ts";
import { CommandContext, Context } from "grammy/mod.ts";

export default async function testComand(ctx: CommandContext<Context>) {
  try {
    await checkJobs();
  } catch (e) {
    console.error(e);
    await ctx.reply("Error").catch(console.error);
  }
}
