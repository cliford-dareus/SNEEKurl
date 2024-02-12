import express from "express";
import {
  create_subscription,
  retrieveSubscription,
} from "../controllers/stripe";
import isFreemiumDone from "../middlewares/checkFreemium";

const router = express.Router();

router.route("/create-subscription").post(create_subscription);
router
  .route("/retrieve-subscription")
  .get(isFreemiumDone, retrieveSubscription);

export default router;
