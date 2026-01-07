import mongoose from "mongoose";
import { extractErrorMessage } from "utilzify";
import { MongoDBAdapter, type ISession } from "@grammyjs/storage-mongodb";
import { GrammyError, session as grammySession, HttpError, type ErrorHandler, type MiddlewareFn } from "grammy";

import { notifyDeveloper } from "@/utils";
import { askToSubscribe, checkIsAdmin, checkIsSubscribed } from "@/bot/utils";

import type { BotCTX, IBotSession } from "./types";

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

export const errorHandlerMiddleware: ErrorHandler<BotCTX> = async err => {
  const errorMessage = extractErrorMessage(err.error);
  await notifyDeveloper({ message: errorMessage, isError: true });

  if (err.error instanceof GrammyError) {
    console.error("Request error:", err.error.description);
  } else if (err.error instanceof HttpError) {
    console.error("Could not contact Telegram:", err.error);
  } else {
    console.error("Unknown error:", err.error);
  }
};
