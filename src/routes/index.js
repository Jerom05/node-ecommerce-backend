import { Router } from 'express';

import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';

const router = Router();

router.use('/users', userRoutes);
router.use('/auth', authRoutes);

export default router;
