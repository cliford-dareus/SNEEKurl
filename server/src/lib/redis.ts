import Redis from "ioredis";

/**
 * Shared Redis client.
 * - Uses REDIS_URL when available (recommended in production).
 * - Falls back to null in development so the app still runs without Redis.
 */
let redis: Redis | null = null;

export const getRedis = (): Redis | null => {
  if (redis) return redis;

  const url = process.env.REDIS_URL;
  if (!url) {
    if (process.env.NODE_ENV === "production") {
      console.warn(
        "[redis] REDIS_URL is not set. Token blacklist and some rate limiters will use in-memory fallbacks."
      );
    }
    return null;
  }

  try {
    redis = new Redis(url, {
      maxRetriesPerRequest: 3,
      enableReadyCheck: true,
      lazyConnect: true,
    });

    redis.on("error", (err) => {
      console.error("[redis] connection error:", err.message);
    });

    // Connect in background; don't block startup
    redis.connect().catch((err) => {
      console.error("[redis] failed to connect:", err.message);
      redis = null;
    });

    return redis;
  } catch (err: any) {
    console.error("[redis] init failed:", err?.message);
    return null;
  }
};

export default getRedis;
