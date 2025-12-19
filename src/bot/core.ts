import { Bot } from "grammy";

import handler from "@/bot/handlers";
import type { BotCTX } from "@/bot/types";
import { sessionMiddleware } from "@/bot/middlewares";

const bot = new Bot<BotCTX>(process.env.BOT_TOKEN!);

bot.use(sessionMiddleware);
bot.use(handler);

export default bot;
