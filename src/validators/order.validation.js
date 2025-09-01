import Joi from 'joi';

export const createOrderSchema = Joi.object({
  products: Joi.array()
    .items(
      Joi.object({
        product_id: Joi.string().required(),
        quantity: Joi.number().required(),
      }).required()
    )
    .required(),
  name: Joi.string().required(),
  phone: Joi.string().required(),
  other_contact: Joi.string(),
  email: Joi.string().email().required(),
  comments: Joi.string(),
  shipping_address: Joi.string().required(),
}).required();

export const updateOrderSchema = Joi.object({
  name: Joi.string(),
  phone: Joi.string(),
  other_contact: Joi.string().allow(null, ''),
  email: Joi.string().email(),
  comments: Joi.string().allow(null, ''),
  shipping_address: Joi.string(),
  status: Joi.string().valid(
    'pending',
    'confirmed',
    'shipped',
    'delivered',
    'cancelled'
  ),
  payment_status: Joi.string().valid('pending', 'paid'),
}).required();
