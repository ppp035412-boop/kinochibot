import type { MiddlewareFn } from "grammy";

export const addChannelEvent: MiddlewareFn = async ctx => {
  const chatId = ctx.chat?.id || 0;
  console.log(chatId);
};
