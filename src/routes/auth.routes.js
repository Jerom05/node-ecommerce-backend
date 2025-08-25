import { Router } from 'express';

import { authController as auth } from '../controllers/index.js';
import { validateRequest } from '../middlewares/validate.js';
import { signinSchema } from '../validators/auth.validation.js';

const router = Router();

router.post('/signin', validateRequest(signinSchema, 'body'), auth.signin);
router.post('/signup', auth.signup);

export default router;
