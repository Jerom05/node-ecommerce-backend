import { Router } from 'express';

import { categoryController as category } from '../controllers/index.js';
import { auth, requireRoles } from '../middlewares/index.js';

const router = Router();

router.post('/', auth, requireRoles(['ADMIN']), category.createCategory);
router.get('/', category.getCategories);
router.get('/:id', category.getCategory);
router.put('/:id', auth, requireRoles(['ADMIN']), category.updateCategory);
router.delete('/:id', auth, requireRoles(['ADMIN']), category.deleteCategory);
export default router;
