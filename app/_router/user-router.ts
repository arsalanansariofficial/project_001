import { Router } from 'express';

import auth from '../_middleware/auth';
import * as userHandler from '../_middleware/user-handler';

const router = Router();

router.post('/user/login', userHandler.loginHandler);

router.post('/user/signup', userHandler.signupHandler);

router.put('/user/update', auth, userHandler.updateUserHandler);

router.delete('/user/delete', auth, userHandler.deleteUserHandler);

export default router;
