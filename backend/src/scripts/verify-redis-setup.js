import express from "express";
import { cacheResponse, invalidateCache } from "../middlewares/cache.middleware.js";
import { globalLimiter, authLimiter } from "../middlewares/rateLimiter.middleware.js";
import { isRedisReady, getCache, setCache, redisClient } from "../config/redis.js";

const testApp = async () => {
  console.log("=== Redis & Caching Verification Test ===");

  // Wait up to 3s if redisClient is initializing
  if (redisClient && !isRedisReady()) {
    await new Promise((resolve) => {
      redisClient.once("ready", resolve);
      setTimeout(resolve, 3000);
    });
  }

  console.log("1. Redis Ready Status:", isRedisReady());

  // Test Redis cache methods
  console.log("2. Testing cache helpers...");
  await setCache("test:key", { message: "ok" }, 10);
  const val = await getCache("test:key");
  console.log("   Get test key result:", val ? JSON.stringify(val) : "null");
  await invalidateCache("test:*");
  console.log("   Invalidation test completed.");

  // Test Express setup with middlewares
  const app = express();
  app.use(express.json());
  app.use("/api", globalLimiter);
  app.post("/api/auth/login", authLimiter, (req, res) => {
    res.json({ success: true, message: "Logged in" });
  });

  let hitCount = 0;
  app.get("/api/test-cache", cacheResponse(60, "test"), (req, res) => {
    hitCount++;
    res.json({ count: hitCount, time: Date.now() });
  });

  const server = app.listen(0, async () => {
    const port = server.address().port;
    console.log(`3. Test server listening on ephemeral port ${port}`);

    try {
      // Fetch /api/test-cache twice
      const res1 = await fetch(`http://127.0.0.1:${port}/api/test-cache`);
      const data1 = await res1.json();
      const xCache1 = res1.headers.get("x-cache");
      const rateLimitLimit = res1.headers.get("ratelimit-limit");
      const rateLimitRemaining = res1.headers.get("ratelimit-remaining");

      console.log("   Request 1 -> X-Cache:", xCache1, "| Data:", data1, "| RateLimit-Limit:", rateLimitLimit, "| Remaining:", rateLimitRemaining);

      const res2 = await fetch(`http://127.0.0.1:${port}/api/test-cache`);
      const data2 = await res2.json();
      const xCache2 = res2.headers.get("x-cache");

      console.log("   Request 2 -> X-Cache:", xCache2, "| Data:", data2);

      // Fetch /api/auth/login
      const authRes = await fetch(`http://127.0.0.1:${port}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const authRateLimit = authRes.headers.get("ratelimit-limit");
      const authRemaining = authRes.headers.get("ratelimit-remaining");
      console.log("   Auth Request -> RateLimit-Limit:", authRateLimit, "| Remaining:", authRemaining);

      console.log("=== Verification Completed Successfully! ===");
    } catch (err) {
      console.error("Test fetch error:", err);
    } finally {
      server.close();
      process.exit(0);
    }
  });
};

testApp();
