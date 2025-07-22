import rateLimit from 'express-rate-limit';

// General API rate limiter - more reasonable limits
export const generalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // 100 requests per 15 minutes
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // Use IP address as key
    return req.ip || req.connection.remoteAddress || 'unknown';
  }
});

// Strict rate limiter for auth endpoints
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 login attempts per 15 minutes
  message: {
    error: 'Too many authentication attempts, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful requests
});

// URL creation rate limiter
export const urlCreationRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 URL creations per minute
  message: {
    error: 'Too many URLs created, please slow down.',
    retryAfter: '1 minute'
  },
  keyGenerator: (req: any) => {
    // Rate limit by user ID if authenticated, otherwise by IP
    return req.user?.id || req.ip || 'unknown';
  }
});

// Guest user rate limiter (more restrictive)
export const guestRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // 20 requests per hour for guests
  message: {
    error: 'Guest limit exceeded. Please sign up for higher limits.',
    retryAfter: '1 hour'
  },
  keyGenerator: (req: any) => {
    // Use guest client_id if available, otherwise IP
    return req.guest?.client_id || req.ip || 'unknown';
  }
});

export default generalRateLimiter;
