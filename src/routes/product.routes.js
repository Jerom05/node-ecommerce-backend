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
router.get('/:id', productController.getAProduct);

// Update product
router.put(
  '/:id',
  auth,
  requireRoles(['ADMIN']),
  productController.updateProduct
);

// Delete product
router.delete(
  '/:id',
  auth,
  requireRoles(['ADMIN']),
  productController.deleteProduct
);

// Change product thumbnail
router.put(
  '/:id/thumbnail',
  auth,
  requireRoles(['ADMIN']),
  upload.single('thumbnail'),
  productController.changeProductThumbnail
);

// Remove product thumbnail
router.delete(
  '/:id/thumbnail',
  auth,
  requireRoles(['ADMIN']),
  productController.removeProductThumbnail
);

// Add product images
router.post(
  '/:id/images',
  auth,
  requireRoles(['ADMIN']),
  upload.fields([{ name: 'product_feature_images', maxCount: 5 }]),
  productController.addProductImages
);

// Remove product image
router.delete(
  '/:id/images',
  auth,
  requireRoles(['ADMIN']),
  productController.removeProductImage
);

export default router;
