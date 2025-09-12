import { Router } from 'express';

import {
  getAnUser,
  getMyProfile,
  getUsers,
  updateUser,
} from '../controllers/user.controller.js';
import {
  auth,
  cache,
  cacheClearEvent,
  requireRoles,
} from '../middlewares/index.js';

const router = Router();

router.get('/', auth, cache(), requireRoles(['ADMIN']), getUsers);
router.get('/me', auth, cache(), requireRoles(['USER']), getMyProfile);
router.get('/:id', auth, cache(), requireRoles(['ADMIN']), getAnUser);
router.put(
  '/:id',
  auth,
  requireRoles(['ADMIN']),
  cacheClearEvent('user:updated'),
  updateUser
);

export default router;
