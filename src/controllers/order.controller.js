import { orderService } from '../services/index.js';
import { orderQuery } from '../queries/index.js';
import { withTransaction } from '../utils/with-transaction.js';

export const createOrder = async (req, res) => {
  await withTransaction(async (session) => {
    await orderService.createOrder(req, res, session);
  });
};

export const updateOrder = async (req, res) => {
  await withTransaction(async (session) => {
    await orderService.updateOrder(req, res, session);
  });
};

export const deleteOrder = async (req, res) => {
  await withTransaction(async (session) => {
    await orderService.deleteOrder(req, res, session);
  });
};

export const getOrderById = async (req, res) => {
  await orderQuery.getOrderById(req, res);
};

export const getOrders = async (req, res) => {
  await orderQuery.getOrders(req, res);
};
