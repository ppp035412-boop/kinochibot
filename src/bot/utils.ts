import { get } from "lodash";
import { Context } from "grammy";

import bot from "./core";
import { Admin, Channel } from "@/db/models";
import { ACCESS_STATUSES } from "@/helpers/constants";
import { buildChannelsKeyboard } from "@/bot/keyboards";

export const checkIsAdmin = async (userId: number) => {
  const admin = await Admin.findOne({ telegramId: userId }).lean();
  return admin;
};

export const checkIsSubscribed = async (userId: number) => {
  const channels = await Channel.find();

  if (channels.length < 1) return true;

  for (const channel of channels) {
    try {
      const member = await bot.api.getChatMember(channel.channelId, userId);
      const status = get(member, "status", "left");

      if (!ACCESS_STATUSES.includes(status)) return false;
    } catch (_err) {
      console.log("xatolik: ", _err);
      return false;
    }
  }

  return true;
};

export const askToSubscribe = async (ctx: Context) => {
  const channels = await Channel.find({ isActive: true }).lean();
  const keyboard = buildChannelsKeyboard(channels);

  await ctx.reply(`⚠️ Botdan foydalanish uchun quyidagi kanallarga obuna bo'lishingiz shart:\n\nObuna bo'lgach, "✅ Tekshirish" tugmasini bosing.`, { reply_markup: keyboard });
};
