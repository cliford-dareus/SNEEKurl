import express from "express";
import { create, editUrl, getUrls } from "../controllers/shortener";
import authorize from "../middlewares/authorization";
import isFreemiumDone from "../middlewares/checkFreemium";
import check_limiter_status from "../middlewares/check-links-limiter";

const router = express.Router();

router.route("/create").post(isFreemiumDone, check_limiter_status, create);
router.route("/urls").get(getUrls);
router.route("/edit").put(editUrl);

export default router;
