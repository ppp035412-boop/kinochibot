import { CODE_REGEX, NUM_REGEX } from "@/helpers/constants";

const extractVideoCode = (str: string): number | null => {
  const matchesList = str.match(CODE_REGEX);
  const joinedMatch = matchesList?.join(" ") || "";

  const codes = joinedMatch.match(NUM_REGEX);
  const code = codes?.at(0);

  if (!code && typeof code !== "number") return null;

  return isNaN(Number(code)) ? null : +(code ?? "0");
};

export default extractVideoCode;
