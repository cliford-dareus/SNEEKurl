import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user";
import { unauthorized } from "../lib/api/response";
import { cookieExtractor } from "../lib/utils/jwt";
import { verifyAccessToken } from "../lib/utils/tokens";
import { getRedis } from "../lib/redis";

// In-memory fallback when Redis is unavailable
const memoryBlacklist = new Set<string>();
const BLACKLIST_PREFIX = "token:blacklist:";
const DEFAULT_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days (match refresh token lifetime)

const authorize = async (req: any, res: Response, next: NextFunction) => {
  try {
    const token = cookieExtractor(req);

    if (!token) {
      return unauthorized(res, "No authentication token provided. Please log in.", "NO_TOKEN");
    }

    // Check blacklist (Redis preferred, memory fallback)
    const isBlacklisted = await isTokenBlacklisted(token);
    if (isBlacklisted) {
      return unauthorized(res, "This session has been invalidated. Please log in again.", "TOKEN_BLACKLISTED");
    }

    const decoded = verifyAccessToken(token);
    const user = await User.findById(decoded.user_id);

    if (!user) {
      return unauthorized(res, "User account not found.", "USER_NOT_FOUND");
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return unauthorized(res, "Your session has expired. Please log in again.", "TOKEN_EXPIRED");
    }
    return unauthorized(res, "Invalid authentication token.", "INVALID_TOKEN");
  }
};

export const isTokenBlacklisted = async (token: string): Promise<boolean> => {
  const client = getRedis();
  if (client) {
    try {
      const result = await client.get(`${BLACKLIST_PREFIX}${token}`);
      return result !== null;
    } catch (err) {
      console.error("[blacklist] Redis get failed, falling back to memory:", err);
    }
  }
  return memoryBlacklist.has(token);
};

/**
 * Blacklist a token (e.g. on logout).
 * TTL defaults to 7 days so expired tokens are cleaned up automatically in Redis.
 */
export const blacklistToken = async (
  token: string,
  ttlSeconds: number = DEFAULT_TTL_SECONDS
): Promise<void> => {
  const client = getRedis();
  if (client) {
    try {
      await client.setex(`${BLACKLIST_PREFIX}${token}`, ttlSeconds, "1");
      return;
    } catch (err) {
      console.error("[blacklist] Redis set failed, falling back to memory:", err);
    }
  }
  memoryBlacklist.add(token);
};

export default authorize;
