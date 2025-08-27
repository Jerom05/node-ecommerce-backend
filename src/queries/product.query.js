import { Product } from '../models/index.js';

export const getAProduct = async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  if (!product) throw new Error(`Product with ID ${id} not found`);
  res.status(200).json({ data: product });
};
export const getProducts = async (req, res) => {
  const { page = 1, limit = 10, category_id, search_keyword } = req.query;

  const query = {};

  if (category_id) query.category_id = category_id;

  if (search_keyword) {
    query.$or = [
      { title: { $regex: search_keyword, $options: 'i' } },
      { description: { $regex: search_keyword, $options: 'i' } },
    ];
  }

  const products = await Product.find(query, null, {
    skip: (page - 1) * limit,
    limit: parseInt(limit),
  });
  const product_count = await Product.countDocuments();
  res.status(200).json({
    data: products,
    meta_data: { total_data: product_count, filtered_data: products.length },
  });
};
