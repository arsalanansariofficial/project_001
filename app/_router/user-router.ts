import { Router } from 'express';

import * as userHandler from '../_middleware/user-handler';

const router = Router();

router.post('/user/login', userHandler.loginHandler);

router.post('/user/signup', userHandler.signupHandler);

// router.put('/user/update', userHandler.updateUrlHandler);

// router.delete('/user/delete', userHandler.deleteUrlHandler);

export default router;
