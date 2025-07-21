import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user";
import { StatusCodes } from "http-status-codes";
import { cookieExtractor } from "../lib/utils/jwt";
import { verifyAccessToken } from "../lib/utils/tokens";

// Token blacklist (in production, use Redis)
const tokenBlacklist = new Set<string>();

const authorize = async (req: any, res: Response, next: NextFunction) => {
  try {
    const token = cookieExtractor(req);

    if (!token) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            message: "No token provided",
            code: "NO_TOKEN"
        });
    }

    // Check if token is blacklisted
    if (tokenBlacklist.has(token)) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            message: "Token invalidated",
            code: "TOKEN_BLACKLISTED"
        });
    }

    console.log(token);
    const decoded = verifyAccessToken(token);
    const user = await User.findById(decoded.user_id);

    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: "User not found",
        code: "USER_NOT_FOUND"
      });
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: "Token expired",
        code: "TOKEN_EXPIRED"
      });
    }
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: "Invalid token",
      code: "INVALID_TOKEN"
    });
  }
};

export const blacklistToken = (token: string) => {
  tokenBlacklist.add(token);
};

export default authorize;
