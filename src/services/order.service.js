import { Counter, Order, Product } from '../models/index.js';

export const createOrder = async (req, res, session) => {
  const {
    name,
    phone,
    other_contact,
    email,
    comments,
    shipping_address,
    products,
  } = req.body;

  const productIds = products.map((item) => item.product_id);
  const existingProducts = await Product.find(
    { _id: { $in: productIds } },
    null,
    { session }
  );

  const productMap = new Map();
  existingProducts.forEach((product) =>
    productMap.set(product._id.toString(), product)
  );

  let total_price = 0;
  const productDetails = [];

  for (const item of products) {
    const product = productMap.get(item.product_id);
    if (!product) {
      throw new Error(`Product with ID ${item.product_id} not found`);
    }
    if (product.stock < item.quantity) {
      throw new Error(`Product with ID ${item.product_id} is out of stock`);
    }

    await Product.updateOne(
      { _id: item.product_id },
      { $inc: { stock: -item.quantity } },
      { session }
    );

    total_price += product.price * item.quantity;
    productDetails.push({
      product: product._id,
      title: product.title,
      price: product.price,
      quantity: item.quantity,
    });
  }

  const newOrder = new Order({
    name,
    phone,
    other_contact,
    email,
    comments,
    shipping_address,
    products: productDetails,
    order_serial: await Counter.getNextSequence('order_serial'),
    total_price,
  });
  await newOrder.save({ session });

  res
    .status(201)
    .json({ message: 'Order created successfully', data: newOrder });
};

export const updateOrder = async (req, res, session) => {
  const { id: orderId } = req.params || {};
  const {
    name,
    phone,
    other_contact,
    email,
    comments,
    shipping_address,
    payment_status,
    status,
  } = req.body || {};

  if (!orderId) {
    throw new Error('Order ID is required');
  }

  const order = await Order.findById(orderId, null, { session });
  if (!order) throw new Error('Order not found');

  if (['cancelled', 'delivered'].includes(order.status)) {
    throw new Error(`Cannot update order with status ${order.status}`);
  }

  if (status === 'delivered' && order.payment_status !== 'paid') {
    throw new Error('Cannot mark order as delivered if payment is not paid');
  }

  if (name) order.name = name;
  if (phone) order.phone = phone;
  if (other_contact) order.other_contact = other_contact;
  if (email) order.email = email;
  if (comments) order.comments = comments;
  if (shipping_address) order.shipping_address = shipping_address;
  if (status) order.status = status;
  if (payment_status) order.payment_status = payment_status;

  await order.save({ session });

  if (status === 'cancelled') {
    const stockUpdates = order.products.map((item) =>
      Product.updateOne(
        { _id: item.product },
        { $inc: { stock: item.quantity } },
        { session }
      )
    );
    await Promise.all(stockUpdates);
  }

  return res.status(200).json({
    message: 'Order updated successfully',
    data: order,
  });
};

export const deleteOrder = async (req, res, session) => {
  const { id: orderId } = req.params || {};

  if (!orderId) throw new Error('Order ID is required');

  const order = await Order.findById(orderId, null, { session });
  if (!order) throw new Error('Order not found');

  await Order.deleteOne({ _id: orderId }, { session });

  if (order.status === 'pending' || order.status === 'confirmed') {
    const stockUpdates = order.products.map((item) =>
      Product.updateOne(
        { _id: item.product },
        { $inc: { stock: item.quantity } },
        { session }
      )
    );
    await Promise.all(stockUpdates);
  }

  return res.status(200).json({ message: 'Order deleted successfully' });
};
