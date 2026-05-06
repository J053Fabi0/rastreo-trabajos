import { Bot } from "grammy/mod.ts";
import { BOT_TOKEN } from "../env.ts";
import getTime from "../utils/getTime.ts";
import { autoRetry } from "grammy_auto_retry";
import queryHandler from "./queryHandler/queryHandler.ts";
import generalHandler from "./generalHandler/generalHandler.ts";
import comandsHandler from "./comandsHandler/comandsHandler.ts";

const bot = new Bot(BOT_TOKEN);

export default bot;

bot.use(comandsHandler);
bot.use(queryHandler);
bot.use(generalHandler);

bot.catch(({ ctx, error }) => {
  console.log(getTime());
  console.error(`Error while handling update ${ctx.update.update_id}:`, error);
  ctx.reply("There was an error.");
});

bot.start({ onStart: () => console.log("Bot started", getTime()) });

bot.api.setMyCommands([{ command: "subscribe", description: "Suscribir a descuentos" }]);

// @ts-ignore sí funciona
bot.api.config.use(autoRetry());
