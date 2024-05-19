import express from "express";
import {
  create_subscription,
  retrieveSubscription,
  updateSubscription,
} from "../controllers/stripe";
import isFreemiumDone from "../middlewares/checkFreemium";

const router = express.Router();

router
  .route("/retrieve-subscription")
  .get(isFreemiumDone, retrieveSubscription);
router.route("/create-subscription").post(create_subscription);
router.route("/update-subscription").put(isFreemiumDone, updateSubscription);

export default router;
