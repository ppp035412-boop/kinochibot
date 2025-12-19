import { get } from "lodash";
import { Composer } from "grammy";

import { Channel, Video } from "@/db/models";
import type { BotCTX } from "@/bot/types";
import callbacksHandler from "@/bot/callbacks";
import { adminKeyboard } from "@/bot/keyboards";
import { extractVideoCode, getFile } from "@/utils";
import { SOURCE_CHANNEL_ID } from "@/helpers/constants";
import { checkMembershipMiddleware } from "@/bot/middlewares";
import { askToSubscribe, checkIsAdmin, checkIsSubscribed } from "@/bot/utils";

const handler = new Composer<BotCTX>();

// checking membership before every message
handler.use(checkMembershipMiddleware);

// callback
handler.callbackQuery(/query/, callbacksHandler);

// /start command
handler.command("start", async ctx => {
  const chatId = ctx.chat.id;
  const admin = await checkIsAdmin(chatId);
  const subscribed = await checkIsSubscribed(chatId);

  if (admin) {
    await ctx.reply(`Salom ${admin.fullName}! Botga xush kelibsiz! Botni boshqarishingiz mumkin!`, {
      reply_markup: adminKeyboard,
    });
  } else if (subscribed) {
    await ctx.reply("Botdan foydalanishingiz mumkin! Kod yuboring.");
  } else {
    await askToSubscribe(ctx);
  }
});

// saving videos from the source channel
handler.on("channel_post:video", async ctx => {
  const channelId = get(ctx, "channelPost.chat.id", 0) ?? 0;

  if (channelId === SOURCE_CHANNEL_ID) {
    const video = get(ctx, "channelPost.video");
    const caption = get(ctx, "channelPost.caption", "");
    const fileId = get(video, "file_id");
    const thumbnailFileId = video.cover?.at(-1)?.file_id;
    const code = extractVideoCode(caption);

    if (fileId && caption && code) {
      const isExist = await Video.exists({ code });

      if (isExist) {
        console.log("Video allaqachon mavjud: ", fileId);
        return;
      }

      await Video.create({ fileId, caption, code, thumbnailFileId });
      console.log("Yangi video saqlandi: ", fileId);
    }
  }
});

// handling text messages
handler.on("message:text", async ctx => {
  const text = ctx.message.text.trim();
  const session = ctx.session.state;

  switch (session) {
    case "add_channel": {
      const channelLinks = text.split("\n");

      for (const channelLink of channelLinks) {
        await Channel.create({ username: channelLink?.replace("@", "") });
        await ctx.reply("Kanal muvaffaqiyatli qo'shildi!");
      }

      ctx.session.state = "start";
      break;
    }

    case "start":
    default: {
      const isValidNumberCode = /^\d+$/.test(text);

      if (!isValidNumberCode) {
        return ctx.reply("Noto'g'ri formatdagi kod. Faqat raqam yuboring.");
      }

      const foundVideo = await Video.findOne({ code: +text }).lean();
      const file = foundVideo?.thumbnailFileId ? await getFile(foundVideo?.thumbnailFileId || "") : null;

      if (foundVideo) {
        await ctx.replyWithVideo(foundVideo.fileId, {
          caption: foundVideo.caption,
          cover: file?.file_id,
        });
      } else {
        await ctx.reply("Bunday kodga mos video topilmadi.");
      }

      break;
    }
  }
});

export default handler;
