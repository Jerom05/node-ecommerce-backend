import { productService } from '../services/index.js';
import { productQuery } from '../queries/index.js';
import { withTransaction } from '../utils/with-transaction.js';

export const createProduct = async (req, res) => {
  await withTransaction(async (session) => {
    await productService.createProduct(req, res, session);
  });
};

export const updateProduct = async (req, res) => {
  await withTransaction(async (session) => {
    await productService.updateProduct(req, res, session);
  });
};

export const deleteProduct = async (req, res) => {
  await withTransaction(async (session) => {
    await productService.deleteProduct(req, res, session);
  });
};

export const removeProductThumbnail = async (req, res) => {
  await withTransaction(async (session) => {
    await productService.removeProductThumbnail(req, res, session);
  });
};

export const changeProductThumbnail = async (req, res) => {
  await withTransaction(async (session) => {
    await productService.changeProductThumbnail(req, res, session);
  });
};

export const addProductImages = async (req, res) => {
  await withTransaction(async (session) => {
    await productService.addProductImages(req, res, session);
  });
};

export const removeProductImage = async (req, res) => {
  await withTransaction(async (session) => {
    await productService.removeProductImage(req, res, session);
  });
};

// Queries
export const getProducts = async (req, res) => {
  await productQuery.getProducts(req, res);
};

export const getAProduct = async (req, res) => {
  await productQuery.getAProduct(req, res);
};
