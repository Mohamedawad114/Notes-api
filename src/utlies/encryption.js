import crypto from "node:crypto";

const key = Buffer.from(process.env.CRYPTO_KEY);
const IV = crypto.randomBytes(16);
function encrypt(text) {
  const cipher = crypto.createCipheriv("aes-256-cbc", key, IV);
  let encrypted = cipher.update(text, "utf-8", "hex");
  encrypted += cipher.final("hex");
  return IV.toString("hex") + `:` + encrypted;
}

export default encrypt;
