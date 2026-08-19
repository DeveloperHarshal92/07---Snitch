import rateLimit from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import redisClient from "../config/redis.js";

/**
 * Helper to build a Redis-backed store when Redis client is available,
 * otherwise safely falls back to standard in-memory store.
 */
const getRateLimitStore = (prefix) => {
  if (redisClient) {
    try {
      return new RedisStore({
        sendCommand: (...args) => redisClient.call(...args),
        prefix: `rl:${prefix}:`,
      });
    } catch (err) {
      console.warn(`[RateLimit] Failed to attach RedisStore for '${prefix}', using memory fallback:`, err.message);
    }
  }
  return undefined;
};

/**
 * Global rate limiter for general API routes.
 * 200 requests per 15-minute window per IP.
 */
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 200,
  standardHeaders: true,
  legacyHeaders: false,
  store: getRateLimitStore("global"),
  message: {
    success: false,
    message: "Too many requests from this IP, please try again after 15 minutes.",
  },
});

/**
 * Strict rate limiter for sensitive authentication endpoints (login, register).
 * 10 attempts per 15-minute window per IP to prevent brute-force attacks.
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  store: getRateLimitStore("auth"),
  message: {
    success: false,
    message: "Too many authentication attempts from this IP, please try again after 15 minutes.",
  },
});
