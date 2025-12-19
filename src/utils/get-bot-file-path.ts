import type { File } from "grammy/types";

const getBotFilePath = (botToken: string, file?: File) => {
  if (!file?.file_path) return null;

  const url = `https://api.telegram.org/file/bot${botToken}/${file.file_path}`;
  return url;
};

export default getBotFilePath;
