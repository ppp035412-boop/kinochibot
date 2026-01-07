import bot from "@/bot/core";

export interface NotifyDevelopersOptions {
  message: string;
  isError?: boolean;
}

const notifyDeveloper = async ({ message = "", ...opts }: NotifyDevelopersOptions): Promise<void> => {
  const telegramMessage = `${opts.isError ? `<b>Xatolik yuz berdi</b>:${message}` : ""}`;

  if (opts.isError && message) {
    await bot.api.sendMessage(process.env.ADMIN_CHAT_ID!, telegramMessage, { parse_mode: "HTML" });
    return;
  }

  if (message) {
    await bot.api.sendMessage(process.env.ADMIN_CHAT_ID!, message, { parse_mode: "HTML" });
  }
};

export default notifyDeveloper;
