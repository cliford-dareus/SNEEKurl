import express from "express";
import { create, editUrl, getUrls, visitUrl } from "../controllers/shortener";
import authorize from "../middlewares/authorization";
import isFreemiumDone from "../middlewares/checkFreemium";
import check_limiter_status from "../middlewares/check-links-limiter";

const router = express.Router();

router.route("/create").post(isFreemiumDone, check_limiter_status, create);
router.route("/urls").get(getUrls);
router.route("/edit").put(editUrl);
router.route("/:short").get(visitUrl);

export default router;
