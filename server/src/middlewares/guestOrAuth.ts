import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user";
import { StatusCodes } from "http-status-codes";

const guestOrAuth = async (req: any, res: Response, next: NextFunction) => {
  try {
    // Try authenticated user first
    const authToken = req.signedCookies["auth.sid"];
    if (authToken) {
      const decoded = jwt.verify(authToken, process.env.JWT_SECRET!) as jwt.JwtPayload;
      const user = await User.findById(decoded.user_id);

      if (user) {
        req.user = user;
        req.userType = "authenticated";
        req.session.isAuthenticated = true;
        return next();
      }
    }

    // Fall back to guest access
    const guestToken = req.signedCookies["guest.sid"];
    if (guestToken) {
      const decoded = jwt.verify(guestToken, process.env.JWT_SECRET!) as jwt.JwtPayload;
      req.guest = {
        client_id: decoded.client_id,
        user_name: decoded.user_name
      };
      req.userType = "guest";
      req.session.isAuthenticated = false;
      return next();
    }

    // No valid tokens
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: "Access denied. Please authenticate or continue as guest."
    });

  } catch (error) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: "Invalid authentication"
    });
  }
};

export default guestOrAuth;
