import { Router } from 'express';
import * as urlHanlder from '../_middleware/url-handler';

const router = Router();

router.get('/:slug', urlHanlder.getUrlHandler);

router.post('/add', urlHanlder.addUrlHandler);

router.put('/:slug', urlHanlder.updateUrlHandler);

router.delete('/delete', urlHanlder.addUrlHandler);

export default router;
