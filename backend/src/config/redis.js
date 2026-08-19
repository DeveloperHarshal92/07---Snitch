import Redis from "ioredis";
import { config } from "./config.js";

let redisClient = null;
let isConnected = false;

const redisUri = config.REDIS_URI || process.env.REDIS_URI;

if (redisUri) {
  try {
    redisClient = new Redis(redisUri, {
      maxRetriesPerRequest: 3,
      enableReadyCheck: true,
      retryStrategy(times) {
        if (times > 10) {
          console.warn("[Redis] Max reconnect attempts reached. Redis will remain disconnected.");
          return null;
        }
        return Math.min(times * 200, 2000);
      },
      reconnectOnError(err) {
        const targetError = "READONLY";
        if (err.message.includes(targetError)) {
          return true;
        }
        return false;
      },
    });

    redisClient.on("connect", () => {
      console.log("[Redis] Connecting to Redis instance...");
    });

    redisClient.on("ready", () => {
      isConnected = true;
      console.log("[Redis] Connected and ready to use.");
    });

    redisClient.on("error", (err) => {
      isConnected = false;
      console.error("[Redis] Error:", err.message);
    });

    redisClient.on("close", () => {
      isConnected = false;
      console.warn("[Redis] Connection closed.");
    });

    redisClient.on("reconnecting", (time) => {
      console.log(`[Redis] Reconnecting in ${time}ms...`);
    });
  } catch (error) {
    console.error("[Redis] Failed to initialize client:", error.message);
    redisClient = null;
  }
} else {
  console.warn(
    "[Redis] REDIS_URI is not defined in environment variables. Caching & Redis rate limiting will operate in fallback mode."
  );
}

export const isRedisReady = () => isConnected && redisClient && redisClient.status === "ready";

export const getCache = async (key) => {
  if (!isRedisReady()) return null;
  try {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    console.error(`[Redis] getCache error for key '${key}':`, err.message);
    return null;
  }
};

export const setCache = async (key, value, ttlInSeconds = 300) => {
  if (!isRedisReady()) return false;
  try {
    const stringified = JSON.stringify(value);
    if (ttlInSeconds > 0) {
      await redisClient.set(key, stringified, "EX", ttlInSeconds);
    } else {
      await redisClient.set(key, stringified);
    }
    return true;
  } catch (err) {
    console.error(`[Redis] setCache error for key '${key}':`, err.message);
    return false;
  }
};

export const delCache = async (key) => {
  if (!isRedisReady()) return false;
  try {
    await redisClient.del(key);
    return true;
  } catch (err) {
    console.error(`[Redis] delCache error for key '${key}':`, err.message);
    return false;
  }
};

export const delCacheByPattern = async (pattern) => {
  if (!isRedisReady()) return false;
  try {
    return new Promise((resolve) => {
      const stream = redisClient.scanStream({
        match: pattern,
        count: 100,
      });

      let totalDeleted = 0;
      stream.on("data", async (keys = []) => {
        if (keys.length > 0) {
          stream.pause();
          try {
            await redisClient.del(...keys);
            totalDeleted += keys.length;
          } catch (delErr) {
            console.error(`[Redis] Error deleting batch for pattern '${pattern}':`, delErr.message);
          } finally {
            stream.resume();
          }
        }
      });

      stream.on("end", () => {
        if (totalDeleted > 0) {
          console.log(`[Redis] Invalidated ${totalDeleted} key(s) matching '${pattern}'`);
        }
        resolve(true);
      });

      stream.on("error", (err) => {
        console.error(`[Redis] Pattern scan error for '${pattern}':`, err.message);
        resolve(false);
      });
    });
  } catch (err) {
    console.error(`[Redis] delCacheByPattern error for pattern '${pattern}':`, err.message);
    return false;
  }
};

export { redisClient };
export default redisClient;
