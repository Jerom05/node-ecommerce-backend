import { Router } from 'express';

import { upload } from '../config/index.js';
import {
  auth,
  requireRoles,
  validateRequest,
  cache,
  cacheClearEvent,
} from '../middlewares/index.js';
import { createProductSchema } from '../validators/product.validation.js';
import { productController } from '../controllers/index.js';

const router = Router();

// Create product
router.post(
  '/',
  auth,
  requireRoles(['ADMIN']),
  upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'product_feature_images', maxCount: 5 },
  ]),
  validateRequest(createProductSchema, 'body'),
  cacheClearEvent('product:changed'),
  productController.createProduct
);

// Get all products
router.get('/', cache(), productController.getProducts);

// Get product by id
router.get('/:id', cache(60), productController.getAProduct);

// Update product
router.put(
  '/:id',
  auth,
  requireRoles(['ADMIN']),
  cacheClearEvent('product:changed'),
  productController.updateProduct
);

// Delete product
router.delete(
  '/:id',
  auth,
  requireRoles(['ADMIN']),
  cacheClearEvent('product:changed'),
  productController.deleteProduct
);

// Change product thumbnail
router.put(
  '/:id/thumbnail',
  auth,
  requireRoles(['ADMIN']),
  upload.single('thumbnail'),
  cacheClearEvent('product:changed'),
  productController.changeProductThumbnail
);

// Remove product thumbnail
router.delete(
  '/:id/thumbnail',
  auth,
  requireRoles(['ADMIN']),
  cacheClearEvent('product:changed'),
  productController.removeProductThumbnail
);

// Add product images
router.post(
  '/:id/images',
  auth,
  requireRoles(['ADMIN']),
  upload.fields([{ name: 'product_feature_images', maxCount: 5 }]),
  cacheClearEvent('product:changed'),
  productController.addProductImages
);

// Remove product image
router.delete(
  '/:id/images',
  auth,
  requireRoles(['ADMIN']),
  cacheClearEvent('product:changed'),
  productController.removeProductImage
);

export default router;
