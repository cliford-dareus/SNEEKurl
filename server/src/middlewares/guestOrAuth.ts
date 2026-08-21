import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user";
import { unauthorized } from "../lib/api/response";

const guestOrAuth = async (req: any, res: Response, next: NextFunction) => {
  try {
    const authToken = req.signedCookies["auth.sid"];
    if (authToken) {
      const decoded = jwt.verify(
        authToken,
        process.env.JWT_SECRET!
      ) as jwt.JwtPayload;
      const user = await User.findById(decoded.user_id);

      if (user) {
        req.user = user;
        req.userType = "authenticated";
        if (req.session) req.session.isAuthenticated = true;
        return next();
      }
    }

    const guestToken = req.signedCookies["guest.sid"];
    if (guestToken) {
      const decoded = jwt.verify(
        guestToken,
        process.env.JWT_SECRET!
      ) as jwt.JwtPayload;
      req.guest = {
        client_id: decoded.client_id,
        user_name: decoded.user_name,
      };
      req.userType = "guest";
      if (req.session) req.session.isAuthenticated = false;
      return next();
    }

    return unauthorized(
      res,
      "Access denied. Please log in or continue as a guest.",
      "AUTH_REQUIRED"
    );
  } catch {
    return unauthorized(
      res,
      "Invalid or expired authentication. Please log in again.",
      "INVALID_AUTH"
    );
  }
};

export default guestOrAuth;
