import express from 'express';
import { deleteShort, getShortenUrl, shortenUrl, visitShort, getShort, updateShort } from '../controllers/shortener';

const router = express.Router();

router.route('/all').get(getShort).get(getShortenUrl);
router.route('/').post(shortenUrl);
router.route('/:shortUrl')
        .get(visitShort)    
        .delete(deleteShort)
        .patch(updateShort);

export default router;