import { InlineKeyboard } from "grammy";

export const adminKeyboard = new InlineKeyboard()
  .text("Kanallar qo'shish", "query_add_channel")
  .row()
  .text("Kanallar ro'yxati", "query_channels_list")
  .row()
  .text("Admin uchun havola olish", "query_get_admin_link")
  .row()
  .text("Barcha filmlar ro'yxati", "query_all_movies_list");
