import express from 'express';
import { deleteShort, getShortenUrl, shortenUrl, visitShort, getShort } from '../controllers/shortener';

const router = express.Router();

router.route('/all').get(getShort).get(getShortenUrl);
router.route('/').post(shortenUrl);
router.route('/:shortUrl').get(visitShort).delete(deleteShort);

export default router;