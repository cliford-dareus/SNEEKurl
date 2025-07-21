import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import Redis from 'ioredis';

// Only use Redis in production
const redisClient = process.env.NODE_ENV === 'production'
  ? new Redis(process.env.REDIS_URL!)
  : null;

// Advanced rate limiter with Redis store
export const advancedRateLimiter = rateLimit({
  store: redisClient ? new RedisStore({
    sendCommand: (...args: any[]) => redisClient.call(...args) as Promise<any>,
  }) : undefined, // Use memory store in development
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: async (req: any) => {
    // Dynamic limits based on user type
    if (req.user) {
      // Authenticated users get higher limits
      const subscription = req.user.stripe_account_id ? 1000 : 200;
      return subscription;
    } else if (req.guest) {
      // Guest users get lower limits
      return 50;
    }
    // Anonymous users get lowest limits
    return 20;
  },
  message: (req: any) => ({
    error: 'Rate limit exceeded',
    limit: req.rateLimit.limit,
    remaining: req.rateLimit.remaining,
    resetTime: new Date(Date.now() + req.rateLimit.msBeforeNext)
  }),
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: any) => {
    // Priority: user ID > guest client_id > IP
    return req.user?.id || req.guest?.client_id || req.ip || 'unknown';
  }
});
