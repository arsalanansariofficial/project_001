import { Router } from 'express';

import auth from '../_middleware/auth';
import * as urlHanlder from '../_middleware/url-handler';

const router = Router();

router.get('/:slug', urlHanlder.getUrlHandler);

router.post('/add', auth, urlHanlder.addUrlHandler);

router.put('/:slug', auth, urlHanlder.updateUrlHandler);

router.delete('/:slug', auth, urlHanlder.deleteUrlHandler);

export default router;
