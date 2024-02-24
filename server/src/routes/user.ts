import express from "express";
import authorize from "../middlewares/authorization";
import {resetPassword, updateProfileDetails, updateProfileImage} from "../controllers/user";

const router = express.Router();

router.route("/update-image").put(authorize, updateProfileImage);
router.route("/update-info").put(authorize, updateProfileDetails);
router.route('/reset-password').get(resetPassword)


export default router;