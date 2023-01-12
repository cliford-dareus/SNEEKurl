import express from 'express';
import { deleteShort, getShortenUrl, shortenUrl, visitShort, getShort, updateShort } from '../controllers/shortener';
import authorize from '../middlewares/authorization';

const router = express.Router();

router.route('/all').get(getShortenUrl).get(authorize, getShort);
router.route('/').post(shortenUrl);
router.route('/:shortUrl')
        .get(visitShort)    
        .delete(deleteShort)
        .patch(updateShort);

export default router;