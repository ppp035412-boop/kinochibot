import type { IChannel } from "@/helpers/interfaces";
import { InlineKeyboard } from "grammy";

export const adminKeyboard = new InlineKeyboard()
  .text("Kanallar qo'shish", "query_add_channel")
  .row()
  .text("Kanallar ro'yxati", "query_channels_list")
  .row()
  .text("Admin uchun havola olish", "query_get_admin_link")
  .row()
  .text("Barcha filmlar ro'yxati", "query_all_movies_list");

export const buildChannelsKeyboard = (channels: IChannel[]) => {
  const keyboard = new InlineKeyboard();

  if (channels.length === 0) return;

  for (let i = 0; i < channels.length; i++) {
    const channel = channels[i];
    if (!channel) continue;
    const isUrl = channel.username.startsWith("https://t.me/");
    keyboard.url(`${i + 1}-kanal`, isUrl ? channel.username : `https://t.me/${channel.username}`).row();
  }

  keyboard.text("✅ Tekshirish", "query_check_subscription");
  return keyboard;
};
