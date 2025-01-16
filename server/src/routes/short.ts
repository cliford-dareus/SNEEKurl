import express from "express";
import {
  create,
  deleteUrl,
  editUrl, getClicks,
  getGuestUrl,
  getUrl,
  getUrls,
  visitUrl,
} from "../controllers/shortener";
import authorize from "../middlewares/authorization";

const router = express.Router();

router.route("/").get(getGuestUrl);
router.route("/clicks").get(authorize, getClicks);
router.route("/create").post(create);
router.route("/urls").get(authorize, getUrls);
router.route("/edit").put(authorize, editUrl);
router.route("/delete/:short").delete(deleteUrl);
router.route("/url/:short").get(getUrl);
router.route("/:short").get(visitUrl);


export default router;
