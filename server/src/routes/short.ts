// import express from 'express';
// import { deleteShort, getShortenUrl, shortenUrl, visitShort, getShort, updateShort } from '../controllers/shortener';
// import administration from '../middlewares/administration';
// import authorize from '../middlewares/authorization';

// const router = express.Router();

// router.route('/all').get(authorize, getShortenUrl).get(authorize, getShort);
// router.route('/').post(administration, shortenUrl);
// router.route('/:shortUrl')
//         .get(visitShort)    
//         .delete(deleteShort)
//         .patch(updateShort);

// export default router;