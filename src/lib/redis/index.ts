import Redis from "ioredis";

export const redis = new Redis(process.env.REDIS_URL as string, {
  enableReadyCheck: false,
  maxRetriesPerRequest: 3,
  reconnectOnError(err) {
    const targetError = "READONLY";
    if (err.message.includes(targetError)) {
      return true;
    }
    return false;
  },
  retryStrategy(times) {
    return Math.min(times * 50, 2000);
  },
});

redis.on("connect", () => {
  // biome-ignore lint/suspicious/noConsole: <explanation>
  console.log("Redis connected");
});

redis.on("error", (err) => {
  // biome-ignore lint/suspicious/noConsole: <explanation>
  console.error("Redis error:", err);
});

export default redis;
