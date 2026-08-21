import rateLimit from "express-rate-limit";

const rateLimitHandler = (message: string) => (_req: any, res: any) => {
  res.status(429).json({
    success: false,
    message,
    code: "RATE_LIMITED",
  });
};

export const generalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler(
    "Too many requests from this IP. Please try again in 15 minutes."
  ),
});

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler(
    "Too many login or registration attempts. Please try again in 15 minutes."
  ),
});

export const urlCreationRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: any) => req.user?._id?.toString() || req.user?.id || req.ip || "unknown",
  handler: rateLimitHandler(
    "You are creating links too quickly. Please wait a minute and try again."
  ),
});

export const guestRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: any) => req.guest?.client_id || req.ip || "unknown",
  handler: rateLimitHandler(
    "Guest limit exceeded. Sign up for a free account to get higher limits."
  ),
});

export default generalRateLimiter;
