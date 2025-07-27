import asyncHandler from "express-async-handler";
import redis from "../utlies/redis.js";

const max = 5;
const duration = 60 * 1000 * 1;
export const loginRateLimit = asyncHandler(async (req, res, next) => {
  const ip = req.ip;
  const key = `login attemps:${ip}`;
  const attemp = await redis.get(key);
  if (attemp && parseInt(attemp) >= max) {
    const ttl = await redis.ttl(key);
    return res.status(429).send("try after minute");
  }
  next();
});

export const increaseloginattemp = async (ip) => {
  const key = `login attemps:${ip}`;
  const exists = await redis.exists(key);
  if (exists) {
    await redis.incr(key);
  } else {
    await redis.set(key, 1, "EX", duration);
  }
};

export const resetloginattemp = async (ip) => {
  const key = `login attemps:${ip}`;
  await redis.del(key);
};
