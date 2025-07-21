import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import User from "../models/user";
import { jwt_compare } from "../lib/utils/jwt";
import Short from "../models/short";
import { blacklistToken } from "../middlewares/authorization";
import { generateTokenPair, hashRefreshToken } from "../lib/utils/tokens";
import crypto from "crypto";

const register = async (req: any, res: Response) => {
  const { username, email, password } = req.body;

  if (!username || !password || !email)
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .send({ message: "Please provide an username and password..." });

  try {
    const exist = await User.findOne({ email });
    if (exist) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .send({ message: "Bad credentials..." });
    }

    const done = await User.findOneAndDelete({
      clientId: req.session.client_id,
    });

    const user = await User.create({
      username,
      password,
      email,
      clientId: req.session.client_id,
      freemium: done?.freemium,
    });

    res
      .status(StatusCodes.CREATED)
      .json({ message: "User created", user: { username: user.username } });
  } catch (error) {
    res.status(StatusCodes.BAD_GATEWAY);
  }
};

const login = async (req: any, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .send({ message: "Please provide an username and password..." });

  try {
    const user = await User.findOne({ username });

    if (!user)
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .send({ message: "Bad credentials..." });

    const isPasswordCorrect = await jwt_compare(password, user.password);

    if (!isPasswordCorrect)
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .send({ message: "Bad credentials..." });

    // Generate token pair
    const { accessToken, refreshToken } = generateTokenPair(user._id.toString(), user.username);

    // Hash and store refresh token
    const hashedRefreshToken = hashRefreshToken(refreshToken);
    const refreshTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await User.findByIdAndUpdate(user._id, {
      refreshToken: hashedRefreshToken,
      refreshTokenExpiry: refreshTokenExpiry
    });

    // Set cookies
    res.cookie("auth.sid", accessToken, {
      httpOnly: true,
      signed: true,
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie("refresh.sid", refreshToken, {
      httpOnly: true,
      signed: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/auth/refresh' // Only send to refresh endpoint
    });

    req.session.isAuthenticated = true;

    // Handle client_id logic...
    if (req.session.client_id !== user.clientId) {
      await User.findOneAndDelete({ clientId: req.session.client_id });
    }

    res.status(StatusCodes.OK).json({
      message: "Login successful",
      user: {
        username: user.username,
        email: user.email,
        stripe_account_id: user.stripe_account_id,
        isVerified: true,
      },
      accessToken: accessToken,
    });

    // Handle guest data migration...
    const guest_sid = req.signedCookies["guest.sid"];
    if (guest_sid) {
      const guest_id = jwt.verify(guest_sid, process.env.JWT_SECRET!) as jwt.JwtPayload;

      try {
        const shorts = await Short.find({ guest: guest_id.client_id });

        if (shorts) {
          shorts.forEach(async (short) => {
            await Short.findOneAndUpdate(
              { _id: short._id },
              { user: user._id, $unset: { guest: "", expired_in: "" } },
            );
          });
        }
      } catch (error) {}
    }
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: error });
  }
};

const refreshToken = async (req: any, res: Response) => {
  try {
    const refreshToken = req.signedCookies["refresh.sid"];

    if (!refreshToken) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: "No refresh token provided",
        code: "NO_REFRESH_TOKEN"
      });
    }

    // Hash the provided refresh token
    const hashedRefreshToken = hashRefreshToken(refreshToken);

    // Find user with matching refresh token
    const user = await User.findOne({
      refreshToken: hashedRefreshToken,
      refreshTokenExpiry: { $gt: new Date() }
    });

    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: "Invalid or expired refresh token",
        code: "INVALID_REFRESH_TOKEN"
      });
    }

    // Generate new token pair
    const { accessToken, refreshToken: newRefreshToken } = generateTokenPair(
      user._id.toString(),
      user.username
    );

    // Update refresh token in database
    const newHashedRefreshToken = hashRefreshToken(newRefreshToken);
    const newRefreshTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await User.findByIdAndUpdate(user._id, {
      refreshToken: newHashedRefreshToken,
      refreshTokenExpiry: newRefreshTokenExpiry
    });

    // Set new cookies
    res.cookie("auth.sid", accessToken, {
      httpOnly: true,
      signed: true,
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie("refresh.sid", newRefreshToken, {
      httpOnly: true,
      signed: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/auth/refresh'
    });

    res.status(StatusCodes.OK).json({
      message: "Token refreshed successfully",
      user: {
        username: user.username,
        email: user.email,
        stripe_account_id: user.stripe_account_id,
        isVerified: user.isVerified,
      },
      accessToken: accessToken,
    });

  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Token refresh failed"
    });
  }
};

const logout = async (req: any, res: Response) => {
  try {
    // Blacklist the current access token
    if (req.token) {
      blacklistToken(req.token);
    }

    // Clear refresh token from database
    if (req.user) {
      await User.findByIdAndUpdate(req.user._id, {
        $unset: { refreshToken: "", refreshTokenExpiry: "" }
      });
    }

    // Clear session
    req.session.destroy((err: any) => {
      if (err) {
        console.error("Session destruction error:", err);
      }
    });

    // Clear cookies
    res.clearCookie("auth.sid");
    res.clearCookie("refresh.sid");
    res.clearCookie("guest.sid");
    res.clearCookie("session.sid");

    res.status(StatusCodes.OK).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Logout failed" });
  }
};

export { register, login, logout, refreshToken };
