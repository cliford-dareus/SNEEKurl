import  express from "express";
import {getMyPages, createPage, updatePage} from "../controllers/page";
import authorization from "../middlewares/authorization";

const router = express.Router();

router.route('/').get(authorization, getMyPages);
router.route("/create").post(authorization, createPage);
router.route("/update").put(authorization, updatePage);

export default router;