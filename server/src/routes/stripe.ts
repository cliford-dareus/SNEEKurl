import express from "express";
import {
  create_subscription,
  retrieveSubscription,
  updateSubscription,
} from "../controllers/stripe";
import authorize from "../middlewares/authorization";

const router = express.Router();

router
  .route("/retrieve-subscription/:username")
  .get(authorize, retrieveSubscription);
router.route("/create-subscription").post(authorize, create_subscription);
router.route("/update-subscription").put(authorize, updateSubscription);

export default router;
