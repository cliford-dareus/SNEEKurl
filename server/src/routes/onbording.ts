import {onbording} from "../controllers/guest";
import express from "express";


const router = express.Router();
router.post("/", onbording);

export default router