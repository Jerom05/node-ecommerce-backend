import { Router } from 'express';

import {
  getAnUser,
  getMyProfile,
  getUsers,
  updateUser,
} from '../controllers/user.controller.js';
import { auth, requireRoles } from '../middlewares/index.js';

const router = Router();

router.get('/', auth, requireRoles(['ADMIN']), getUsers);
router.get('/me', auth, requireRoles(['USER']), getMyProfile);
router.get('/:id', auth, requireRoles(['ADMIN']), getAnUser);
router.put('/:id', auth, requireRoles(['ADMIN']), updateUser);

export default router;
