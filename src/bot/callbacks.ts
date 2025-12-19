import type { CallbackQueryMiddleware } from "grammy";

import type { BotCTX } from "@/bot/types";
import { checkIsSubscribed } from "@/bot/utils";
import { Channel } from "@/db/models";

const callbacksHandler: CallbackQueryMiddleware<BotCTX> = async ctx => {
  const chatId = ctx.chat?.id || 0;
  const callback_data = ctx.callbackQuery?.data || "";

  switch (true) {
    case /check_subscription/.test(callback_data): {
      const subscribed = await checkIsSubscribed(chatId);

      if (subscribed) {
        await ctx.editMessageText("Botdan foydalanishingiz mumkin! Kod yuboring.");
      } else {
        await ctx.answerCallbackQuery({ show_alert: true, text: "Hali ham barcha kanallarga obuna bo'lmagansiz!" });
        // await ctx.editMessageText("Hali ham barcha kanallarga obuna bo'lmagansiz!");
      }
      break;
    }

    case /add_channel/.test(callback_data):
      ctx.session.state = "add_channel";
      await ctx.editMessageText("Iltimos, kanal IDsini yuboring, Quyidagi shablon bo'yicha: <code>\n-032323111134\n-13759202454322\n...</code>", {
        parse_mode: "HTML",
        link_preview_options: { is_disabled: true },
      });
      break;

    case /channels_list/.test(callback_data): {
      const channels = await Channel.find().lean();
      if (channels.length === 0) {
        await ctx.reply("Hozircha hech qanday kanal qo'shilmagan.");
      }

      await ctx.editMessageText("Kanallar ro'yxati:\n\n" + channels.map((ch, idx) => `<a href="https://t.me/${ch.username}">${idx + 1} - kanal</a>`).join("\n"), {
        parse_mode: "HTML",
      });
      break;
    }

    default:
      await ctx.editMessageText("Noma'lum buyruq amaliyoti");
      break;
  }
};

export default callbacksHandler;
