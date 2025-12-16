import redis from "./index";

export async function checkIpLimit(ip: string, maxCount: number) {
  const today = new Date().toISOString().slice(0, 10);
  const key = `chat:ip:${ip}:${today}`;

  const count = await redis.incr(key);

  if (count === 1) {
    await redis.expire(key, 60 * 60 * 24);
  }

  return {
    isUseable: count <= 5,
    useCount: count,
  };
}
