import bot from "@/bot/core";
import dbConnect from "@/db/db-connect";

bot.start({
  async onStart(botInfo) {
    console.log(`https://t.me/${botInfo.username} has been started`);
    await dbConnect();
  },
});
