import express from "express";
import { register, login, logout, refreshToken } from "../controllers/auth";
import { authRateLimiter } from "../middlewares/rate-limiter";

const router = express.Router();

// Apply strict rate limiting to auth endpoints
router.route("/register").post(authRateLimiter, register);
router.route("/login").post(authRateLimiter, login);
router.route("/logout").post(logout); // No rate limit for logout
router.route("/refresh").post(refreshToken); // No rate limit for refresh

export default router;
