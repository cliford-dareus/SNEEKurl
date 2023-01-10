import express from 'express';
import { deleteShort, getShortenUrl, shortenUrl, visitShort, getShort } from '../controllers/shortener';

const router = express.Router();

router.get('/all', getShortenUrl);
router.post('/', shortenUrl);
router.get('/:shortUrl', visitShort).delete('/:shortUrl', deleteShort);
router.get('/filter', getShort);

export default router;