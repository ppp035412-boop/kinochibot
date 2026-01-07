import { Bot } from "grammy";
import { limit } from "@grammyjs/ratelimiter";

import handler from "@/bot/handlers";
import type { BotCTX } from "@/bot/types";
import { sessionMiddleware } from "@/bot/middlewares";

const bot = new Bot<BotCTX>(process.env.BOT_TOKEN!);

bot.use(
  limit({
    limit: 4,
    timeFrame: 60_000,
    onLimitExceeded: async ctx => await ctx.reply("Juda ko'p so'rov yubordingiz 1 daqiqadan so'ng urinib ko'ring!"),
    keyGenerator: ctx => ctx.from?.id.toString(),
  }),
);
bot.use(sessionMiddleware);
bot.use(handler);

export default bot;
