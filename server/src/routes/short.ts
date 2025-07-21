import express from "express";
import {
  create,
  deleteUrl,
  editUrl,
  getClicks,
  getUrl,
  getUrls,
  visitUrl,
} from "../controllers/shortener";
import authorize from "../middlewares/authorization";
import guestOrAuth from "../middlewares/guestOrAuth";
import check_links_limiter_status from "../middlewares/check-links-limiter";
import { urlCreationRateLimiter, guestRateLimiter } from "../middlewares/rate-limiter";

const router = express.Router();

// Conditional rate limiting middleware
const conditionalRateLimit = (req: any, res: any, next: any) => {
  if (req.userType === "guest") {
    return guestRateLimiter(req, res, next);
  } else {
    return urlCreationRateLimiter(req, res, next);
  }
};

// Guest or authenticated routes with conditional rate limiting and link limits
router.route("/urls").get(guestOrAuth, getUrls);
router.route("/create").post(
  guestOrAuth,
  conditionalRateLimit,
  check_links_limiter_status,
  create
);

// Public routes (no rate limiting for URL visits)
router.route("/:short").get(visitUrl);
router.route("/url/:short").get(getUrl);

// Authenticated only routes
router.route("/clicks").get(authorize, getClicks);
router.route("/edit").put(authorize, editUrl);
router.route("/delete/:short").delete(authorize, deleteUrl);

export default router;
