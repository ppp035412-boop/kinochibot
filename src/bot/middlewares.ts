import mongoose from "mongoose";
import { session as grammySession, type MiddlewareFn } from "grammy";
import { MongoDBAdapter, type ISession } from "@grammyjs/storage-mongodb";

import { askToSubscribe, checkIsAdmin, checkIsSubscribed } from "@/bot/utils";

import type { IBotSession } from "./types";

const collection = mongoose.connection.collection<ISession>("sessions");

export const sessionMiddleware = grammySession({
  initial: (): IBotSession => ({
    state: "start",
    blocked: false,
    name: "",
    username: "",
  }),
  storage: new MongoDBAdapter<IBotSession>({ collection }),
});

export const checkMembershipMiddleware: MiddlewareFn = async (ctx, next) => {
  const chatId = ctx.chat?.id || 0;
  const admin = await checkIsAdmin(chatId);

  if (ctx.msg?.text || ctx.channelPost || admin) {
    return next();
  }

  if (!chatId) return;

  const subscribed = await checkIsSubscribed(chatId);
  if (!subscribed) {
    await askToSubscribe(ctx);
    return;
  }

  return next();
};
