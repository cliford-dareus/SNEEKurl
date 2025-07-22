import { getLinkAnalytics, getUserAnalytics } from "../controllers/analytics";
import express from "express";
import authorize from "../middlewares/authorization";
import guestOrAuth from "../middlewares/guestOrAuth";

const router = express.Router();
router.route("/link/:short").get(guestOrAuth, getLinkAnalytics);
router.route("/user").get(authorize, getUserAnalytics);

export default router
