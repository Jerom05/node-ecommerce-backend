import { Order } from '../models/index.js';
import mongoose from 'mongoose';

export const getOrderById = async (req, res) => {
  const { id } = req.params;

  if (mongoose.Types.ObjectId.isValid(id)) {
    const order = await Order.findById(id);
    if (!order) throw new Error(`Order with ID ${id} not found`);
    return res.status(200).json({ data: order });
  }
  if (typeof parseInt(id) === 'number' && !isNaN(parseInt(id))) {
    const order = await Order.findOne({ order_serial: parseInt(id) });
    if (!order) throw new Error(`Order with Order serial ${id} not found`);
    return res.status(200).json({ data: order });
  }

  throw new Error(`Order with ID ${id} not found`);
};

export const getOrders = async (req, res) => {
  const { page = 1, limit = 10, user_id, status } = req.query;

  const query = {};

  if (user_id) query.user_id = user_id;
  if (status) query.status = status;

  const orders = await Order.find(query, null, {
    skip: (page - 1) * limit,
    limit: parseInt(limit),
  });
  const order_count = await Order.countDocuments();
  res.status(200).json({
    data: orders,
    meta_data: { total_data: order_count, filtered_data: orders.length },
  });
};
