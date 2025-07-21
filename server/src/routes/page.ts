import  express from "express";
import {getMyPages, createPage, updatePage, getPage, managePage} from "../controllers/page";
import authorization from "../middlewares/authorization";
import check_links_limiter_status from "../middlewares/check-links-limiter";

const router = express.Router();

router.route('/').get(authorization, getMyPages);
router.route("/create").post(authorization, check_links_limiter_status, createPage);
router.route("/update").put(authorization, updatePage);
router.route('/manage/:slug').put(authorization, managePage);

router.route('/:slug').get(getPage);

export default router;
