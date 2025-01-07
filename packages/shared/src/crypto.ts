import * as crypto from "crypto";

export const encryptMd5 = (text: string) => {
  const hash = crypto.createHash("md5");
  hash.update(text);
  return hash.digest("hex");
};
