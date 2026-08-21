import { Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user";
import { jwt_compare } from "../lib/utils/jwt";
import Short from "../models/short";
import { blacklistToken } from "../middlewares/authorization";
import { generateTokenPair, hashRefreshToken } from "../lib/utils/tokens";
import {
  created,
  ok,
  badRequest,
  unauthorized,
  conflict,
  internalError,
} from "../lib/api/response";

const userPublic = (user: any) => ({
  username: user.username,
  email: user.email,
  stripe_account_id: user.stripe_account_id,
  isVerified: user.isVerified ?? true,
});

const register = async (req: any, res: Response) => {
  const { username, email, password } = req.body;

  if (!username || !password || !email) {
    return badRequest(res, "Username, email, and password are required.", [
      ...(!username ? [{ field: "username", message: "Username is required" }] : []),
      ...(!email ? [{ field: "email", message: "Email is required" }] : []),
      ...(!password ? [{ field: "password", message: "Password is required" }] : []),
    ], "VALIDATION_ERROR");
  }

  if (typeof username === "string" && (username.length < 4 || username.length > 20)) {
    return badRequest(res, "Username must be between 4 and 20 characters.", [
      { field: "username", message: "Username must be between 4 and 20 characters." },
    ], "VALIDATION_ERROR");
  }

  if (typeof password === "string" && password.length < 6) {
    return badRequest(res, "Password must be at least 6 characters.", [
      { field: "password", message: "Password must be at least 6 characters." },
    ], "VALIDATION_ERROR");
  }

  try {
    const existingEmail = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingEmail) {
      return conflict(res, "An account with this email already exists.", "EMAIL_TAKEN");
    }

    const existingUsername = await User.findOne({ username: username.trim() });
    if (existingUsername) {
      return conflict(res, "This username is already taken.", "USERNAME_TAKEN");
    }

    const guestUser = await User.findOneAndDelete({
      clientId: req.session?.client_id,
    });

    const user = await User.create({
      username: username.trim(),
      password,
      email: email.toLowerCase().trim(),
      clientId: req.session?.client_id,
      freemium: guestUser?.freemium,
    });

    return created(res, "Account created successfully.", {
      user: { username: user.username },
    });
  } catch (error: any) {
    if (error?.code === 11000) throw error;
    console.error("[register]", error);
    return internalError(res, "Could not create account. Please try again.");
  }
};

const login = async (req: any, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return badRequest(res, "Username and password are required.", [
      ...(!username ? [{ field: "username", message: "Username is required" }] : []),
      ...(!password ? [{ field: "password", message: "Password is required" }] : []),
    ], "VALIDATION_ERROR");
  }

  try {
    const user = await User.findOne({ username: username.trim() });

    if (!user) {
      return unauthorized(res, "Invalid username or password.", "INVALID_CREDENTIALS");
    }

    const isPasswordCorrect = await jwt_compare(password, user.password);
    if (!isPasswordCorrect) {
      return unauthorized(res, "Invalid username or password.", "INVALID_CREDENTIALS");
    }

    const { accessToken, refreshToken } = generateTokenPair(
      user._id.toString(),
      user.username
    );

    const hashedRefreshToken = hashRefreshToken(refreshToken);
    const refreshTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await User.findByIdAndUpdate(user._id, {
      refreshToken: hashedRefreshToken,
      refreshTokenExpiry,
    });

    res.cookie("auth.sid", accessToken, {
      httpOnly: true,
      signed: true,
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refresh.sid", refreshToken, {
      httpOnly: true,
      signed: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/auth/refresh",
    });

    if (req.session) req.session.isAuthenticated = true;

    if (req.session?.client_id && req.session.client_id !== user.clientId) {
      await User.findOneAndDelete({ clientId: req.session.client_id });
    }

    const guest_sid = req.signedCookies?.["guest.sid"];
    if (guest_sid) {
      try {
        const guest_id = jwt.verify(
          guest_sid,
          process.env.JWT_SECRET!
        ) as jwt.JwtPayload;
        await Short.updateMany(
          { guest: guest_id.client_id },
          { user: user._id, $unset: { guest: "", expired_in: "" } }
        );
      } catch {
        /* ignore guest migration failures */
      }
    }

    return ok(res, "Login successful.", {
      user: userPublic(user),
      accessToken,
    });
  } catch (error) {
    console.error("[login]", error);
    return internalError(res, "Login failed. Please try again.");
  }
};

const refreshToken = async (req: any, res: Response) => {
  try {
    const token = req.signedCookies?.["refresh.sid"];

    if (!token) {
      return unauthorized(
        res,
        "No refresh token provided. Please log in again.",
        "NO_REFRESH_TOKEN"
      );
    }

    const hashedRefreshToken = hashRefreshToken(token);
    const user = await User.findOne({
      refreshToken: hashedRefreshToken,
      refreshTokenExpiry: { $gt: new Date() },
    });

    if (!user) {
      return unauthorized(
        res,
        "Invalid or expired refresh token. Please log in again.",
        "INVALID_REFRESH_TOKEN"
      );
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokenPair(
      user._id.toString(),
      user.username
    );

    await User.findByIdAndUpdate(user._id, {
      refreshToken: hashRefreshToken(newRefreshToken),
      refreshTokenExpiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    res.cookie("auth.sid", accessToken, {
      httpOnly: true,
      signed: true,
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refresh.sid", newRefreshToken, {
      httpOnly: true,
      signed: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/auth/refresh",
    });

    return ok(res, "Token refreshed successfully.", {
      user: userPublic(user),
      accessToken,
    });
  } catch (error) {
    console.error("[refreshToken]", error);
    return internalError(res, "Token refresh failed. Please log in again.");
  }
};

const logout = async (req: any, res: Response) => {
  try {
    if (req.token) {
      await blacklistToken(req.token);
    }

    if (req.user) {
      await User.findByIdAndUpdate(req.user._id, {
        $unset: { refreshToken: "", refreshTokenExpiry: "" },
      });
    }

    if (req.session?.destroy) {
      req.session.destroy((err: any) => {
        if (err) console.error("Session destruction error:", err);
      });
    }

    res.clearCookie("auth.sid");
    res.clearCookie("refresh.sid");
    res.clearCookie("guest.sid");
    res.clearCookie("session.sid");

    return ok(res, "Logged out successfully.");
  } catch (error) {
    console.error("[logout]", error);
    return internalError(res, "Logout failed. Please try again.");
  }
};

export { register, login, logout, refreshToken };
