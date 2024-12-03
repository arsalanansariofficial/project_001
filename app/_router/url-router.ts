import { Router } from 'express';
import { addUrlHandler, getUrlHandler } from '../_middleware/url-handler';

const router = Router();

router.get('/:slug', getUrlHandler);

router.post('/add', addUrlHandler);

export default router;
