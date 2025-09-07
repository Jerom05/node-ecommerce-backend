import { Router } from 'express';

import { orderController } from '../controllers/index.js';
import {
  auth,
  cache,
  requireRoles,
  validateRequest,
} from '../middlewares/index.js';
import { createOrderSchema } from '../validators/order.validation.js';

const router = Router();

router.post(
  '/',
  validateRequest(createOrderSchema, 'body'),
  orderController.createOrder
);

router.put('/:id', auth, requireRoles(['ADMIN']), orderController.updateOrder);

router.delete(
  '/:id',
  auth,
  requireRoles(['ADMIN']),
  orderController.deleteOrder
);

router.get('/:id', auth, orderController.getOrderById);
router.get(
  '/',
  auth,
  requireRoles(['ADMIN']),
  cache(),
  orderController.getOrders
);
export default router;
