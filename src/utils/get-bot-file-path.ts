import { get } from "lodash";
import type { File } from "grammy/types";

const getBotFilePath = (botToken: string, file?: File) => {
  const filePath = get(file, "file_path");

  if (!filePath) return null;

  const url = `https://api.telegram.org/file/bot${botToken}/${filePath}`;
  return url;
};

export default getBotFilePath;
