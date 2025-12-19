/* eslint-disable @typescript-eslint/no-explicit-any */
import { Context, type MiddlewareFn, type SessionFlavor } from "grammy";

export type IBotStates = "start" | "add_channel" | "get_admin_link" | "all_movies_list";

export type IBotSession = {
  state: IBotStates;
  name: string;
  username: string;
  blocked: boolean;
  __language_code?: string;
};

export type BotCTX = Context & SessionFlavor<IBotSession>;

export type BotHandler = (ctx: BotCTX, next?: Parameters<MiddlewareFn<BotCTX>>[1]) => any;
