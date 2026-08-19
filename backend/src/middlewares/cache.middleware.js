import { getCache, setCache, delCacheByPattern, delCache, isRedisReady } from "../config/redis.js";

/**
 * Express middleware to cache JSON responses in Redis.
 *
 * @param {number} ttlInSeconds - Time to live for cache entry (default: 300s / 5 mins)
 * @param {string|function} keyPrefixOrGenerator - Optional custom prefix string or function (req) => string
 */
export const cacheResponse = (ttlInSeconds = 300, keyPrefixOrGenerator = "") => {
  return async (req, res, next) => {
    // Only cache GET requests
    if (req.method !== "GET") {
      return next();
    }

    if (!isRedisReady()) {
      return next();
    }

    let cacheKey = "";
    if (typeof keyPrefixOrGenerator === "function") {
      cacheKey = keyPrefixOrGenerator(req);
    } else if (keyPrefixOrGenerator) {
      cacheKey = `cache:${keyPrefixOrGenerator}:${req.originalUrl || req.url}`;
    } else {
      cacheKey = `cache:${req.baseUrl || ""}${req.path}:${JSON.stringify(req.query || {})}`;
    }

    try {
      const cached = await getCache(cacheKey);
      if (cached) {
        res.setHeader("X-Cache", "HIT");
        return res.status(200).json(cached);
      }

      // Intercept res.json to cache response payload
      res.setHeader("X-Cache", "MISS");
      const originalJson = res.json.bind(res);

      res.json = (body) => {
        // Cache only successful responses (2xx)
        if (res.statusCode >= 200 && res.statusCode < 300 && body) {
          // Asynchronously write to cache so we don't delay client response
          setCache(cacheKey, body, ttlInSeconds).catch((err) => {
            console.error(`[Cache Middleware] Failed setting key ${cacheKey}:`, err.message);
          });
        }
        return originalJson(body);
      };

      next();
    } catch (err) {
      console.error("[Cache Middleware] Error in cache check:", err.message);
      next();
    }
  };
};

/**
 * Invalidate cache by one or more pattern strings (e.g. "cache:products:*", "cache:reviews:123*")
 * or exact keys.
 *
 * @param {...string} patterns
 */
export const invalidateCache = async (...patterns) => {
  if (!isRedisReady()) return;

  for (const pattern of patterns) {
    if (!pattern) continue;
    if (pattern.includes("*")) {
      await delCacheByPattern(pattern);
    } else {
      await delCache(pattern);
    }
  }
};
