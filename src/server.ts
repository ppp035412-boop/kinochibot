import dns from "dns/promises";

import bot from "@/bot/core";
import dbConnect from "@/db/db-connect";

dns.setServers(["1.1.1.1"]);
bot.start({
  async onStart(botInfo) {
    console.log(`https://t.me/${botInfo.username} has been started`);
    await dbConnect();
  },
});
