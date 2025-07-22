import express from "express";
import {
  updateProfileImage,
  deleteProfileImage,
  updateProfileDetails,
  deleteAccount,
  resetPassword,
  getUserLimits
} from "../controllers/user";
import authorize from "../middlewares/authorization";

const router = express.Router();

router.route("/update-image").put(authorize, updateProfileImage);
router.route("/delete-image").delete(authorize, deleteProfileImage);
router.route("/update-info").put(authorize, updateProfileDetails);
router.route("/delete-account").delete(authorize, deleteAccount);
router.route("/reset-password").get(resetPassword);
router.route("/get-limits").get(authorize, getUserLimits);

export default router;
