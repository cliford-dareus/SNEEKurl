import express from "express";
import { create } from "../controllers/shortener";
import administration from "../middlewares/administration";
import authorize from "../middlewares/authorization";
import isFreemiumDone from "../middlewares/checkFreemium";

const router = express.Router();

router.route("/create").post(isFreemiumDone, create);

export default router;
