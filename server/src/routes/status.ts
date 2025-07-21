import express from "express";
import guestOrAuth from "../middlewares/guestOrAuth";

const router = express.Router();

router.get("/rate-limit", guestOrAuth, (req: any, res) => {
  res.json({
    limit: req.rateLimit?.limit || 'N/A',
    remaining: req.rateLimit?.remaining || 'N/A',
    resetTime: req.rateLimit?.resetTime || 'N/A',
    userType: req.userType || 'anonymous'
  });
});

export default router;