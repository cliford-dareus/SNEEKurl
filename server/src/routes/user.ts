import express from "express";
import { getUserLimits } from "../controllers/user";
import authorize from "../middlewares/authorization";

const router = express.Router();

router.route("/limits").get(authorize, getUserLimits);

export default router;
