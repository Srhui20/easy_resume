import Redis from "ioredis";

export const redis = new Redis(process.env.REDIS_URL as string);

redis.on("connect", () => {
  // biome-ignore lint/suspicious/noConsole: <explanation>
  console.log("Redis connected");
});

redis.on("error", (err) => {
  // biome-ignore lint/suspicious/noConsole: <explanation>
  console.error("Redis error:", err);
});

export default redis;
