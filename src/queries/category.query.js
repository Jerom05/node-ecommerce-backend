import { Category } from '../models/index.js';

export const getAllCategories = async (req, res) => {
  const { page = 1, limit = 10, search_keyword } = req.query;
  const query = {};

  if (search_keyword) {
    query.$or = [
      { name: { $regex: search_keyword, $options: 'i' } },
      { email: { $regex: search_keyword, $options: 'i' } },
    ];
  }

  const categories = await Category.find(query, null, {
    skip: (page - 1) * limit,
    limit: parseInt(limit),
  });
  const category_count = await Category.countDocuments();
  res.status(200).json({
    data: categories,
    meta_data: { total_data: category_count, filtered_data: categories.length },
  });
};

export const getCategoryById = async (req, res) => {
  const { id } = req.params;
  const category = await Category.findById(id);
  if (!category) throw new Error(`Category with ID ${id} not found`);
  res.status(200).json({ message: 'success', data: category });
};
