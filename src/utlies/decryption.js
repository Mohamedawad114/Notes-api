import crypto from "node:crypto";

const key = Buffer.from(process.env.CRYPTO_KEY);

function decrypt(text) {
  const [IVhex, encrypted] = text.split(":");
  const IV = Buffer.from(IVhex, "hex");
  const decipher = crypto.createDecipheriv("aes-256-cbc", key, IV);
  let decrypted = decipher.update(encrypted, "hex", "utf-8");
  decrypted += decipher.final("utf-8");
  return decrypted;
}
export default decrypt;
