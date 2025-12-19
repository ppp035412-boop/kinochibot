import { get } from "lodash";
import { Context, InlineKeyboard } from "grammy";

import bot from "./core";
import { Admin, Channel } from "@/db/models";
import { ACCESS_STATUSES } from "@/helpers/constants";

export const checkIsAdmin = async (userId: number) => {
  const admin = await Admin.findOne({ telegramId: userId }).lean();
  return admin;
};

export const checkIsSubscribed = async (userId: number) => {
  const channels = await Channel.find();

  if (channels.length === 0) return true;

  for (const channel of channels) {
    try {
      const member = await bot.api.getChatMember(channel.username.replace("https://t.me/", "@"), userId);
      const status = get(member, "status", "left");
      console.log(status);

      if (!ACCESS_STATUSES.includes(status)) return false;
    } catch (_err) {
      console.log("xatolik: ", _err);
      return false;
    }
  }

  return true;
};

export const askToSubscribe = async (ctx: Context) => {
  const keyboard = new InlineKeyboard();
  const channels = await Channel.find({ isActive: true }).lean();

  if (channels.length === 0) return;

  for (let i = 0; i < channels.length; i++) {
    const channel = channels[i];
    if (!channel) continue;
    const isUrl = channel.username.startsWith("https://t.me/");
    keyboard.url(`${i + 1}-kanal`, isUrl ? channel.username : `https://t.me/${channel.username}`).row();
  }

  keyboard.text("✅ Tekshirish", "query_check_subscription");

  await ctx.reply(`⚠️ Botdan foydalanish uchun quyidagi kanallarga obuna bo'lishingiz shart:\n\nObuna bo'lgach, "✅ Tekshirish" tugmasini bosing.`, { reply_markup: keyboard });
};
