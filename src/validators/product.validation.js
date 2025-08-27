import Joi from 'joi';

export const createProductSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  category_id: Joi.string().required(),
  price: Joi.number().required(),
  stock: Joi.number().required(),
});

export const updateProductSchema = Joi.object({
  title: Joi.string(),
  description: Joi.string(),
  price: Joi.number(),
  stock: Joi.number(),
});

export const removeProductThumbnailSchema = Joi.object({});

export const getProductSchema = Joi.object({
  product_id: Joi.string().required(),
});
