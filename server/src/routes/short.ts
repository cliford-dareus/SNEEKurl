import express from "express";
import {
  create,
  editUrl,
  getGuestUrl,
  getUrl,
  getUrls,
  visitUrl,
} from "../controllers/shortener";
import authorize from "../middlewares/authorization";
import isFreemiumDone from "../middlewares/checkFreemium";
import check_limiter_status from "../middlewares/check-links-limiter";

const router = express.Router();

router.route("/").get(getGuestUrl);
router.route("/create").post(create);
router.route("/urls").get(authorize, getUrls);
router.route("/edit").put(authorize, editUrl);
router.route("/url/:short").get(getUrl);
router.route("/:short").get(visitUrl);

export default router;
