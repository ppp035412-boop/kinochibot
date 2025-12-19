import bot from "@/bot/core";

const getFile = async (fileId: string) => {
  try {
    return bot.api.getFile(fileId);
  } catch (_error) {
    return null;
  }
};

export default getFile;
