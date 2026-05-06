import "@std/dotenv/load";
export const BOT_TOKEN = Deno.env.get("BOT_TOKEN")!;
export const USERS_ID = Deno.env.get("USERS_ID")!.split(",");
