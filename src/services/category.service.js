import slugify from 'slugify';
import { Category, Product } from '../models/index.js';

export const createCategory = async (req, res, session) => {
  const { title, description } = req.body;
  const slug = slugify(title).toLowerCase();
  const existingCategory = await Category.findOne({ slug }, null, { session });
  if (existingCategory)
    throw new Error('Category with the same name already exists');

  const category = new Category({ title, description, slug });
  await category.save({ session });
  return res
    .status(201)
    .json({ message: 'Category created successfully', data: category });
};

export const updatweCategory = async (req, res, session) => {
  const { id } = req.params;
  const { title, description } = req.body;
  const category = await Category.findById(id, null, { session });
  if (!category) throw new Error(`Category with ID ${id} not found`);
  if (category.slug !== slugify(title).toLowerCase()) {
    const existingCategory = await Category.findOne(
      {
        slug: slugify(title).toLowerCase(),
      },
      null,
      { session }
    );
    if (existingCategory)
      throw new Error('Category with the same name already exists');
    category.slug = slugify(title).toLowerCase();
  }

  category.title = title;
  category.description = description;
  await category.save({ session });
  return res
    .status(200)
    .json({ message: 'Category updated successfully', data: category });
};

export const deleteCategory = async (req, res, session) => {
  const { id } = req.params;
  const category = await Category.findById(id, null, { session });
  if (!category) throw new Error(`Category with ID ${id} not found`);
  const product = await Product.findOne({ category_id: id }, null, { session });
  if (product) throw new Error('Category has products');
  await category.deleteOne({ session });

  return res
    .status(200)
    .json({ message: 'Category deleted successfully', data: category });
};
