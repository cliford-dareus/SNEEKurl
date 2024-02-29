import  express from "express";
import {getMyPages, createPage, updatePage, getPage} from "../controllers/page";
import authorization from "../middlewares/authorization";

const router = express.Router();

router.route('/').get(authorization, getMyPages);
router.route("/create").post(authorization, createPage);
router.route("/update").put(authorization, updatePage);

router.route('/:slug').get(getPage);

export default router;